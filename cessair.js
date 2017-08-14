/**
 * Cessair command line interface tool for package development.
 * This code have to ensure to work on Node.js v6.6.0+ without Babel.
 **/

// Node.js built-in API.
const { exit, stderr, stdout, version } = require('process');

// Third-party modules.
const Bluebird = require('bluebird');
const execa = require('execa');
const { dirAsync, existsAsync, readAsync, writeAsync } = require('fs-jetpack');
const ora = require('ora');
const semver = require('semver');
const yargs = require('yargs');

const usageTemplate = 'Usage:\n  node $0';

function output(message) {
    if(message instanceof Object) {
        if(message.stderr) {
            message.pipe(stderr);
        }

        if(message.stdout) {
            message.pipe(stdout);
        }

        return;
    }

    (message instanceof Error ? stderr : stdout).write(`${message}\n`);
}

function generateBuilder(usageString, chain = yargs => yargs) {
    return yargs => chain(
        yargs
            .usage(`${usageTemplate} ${usageString}`)
            .help('help', 'print this message')
    ).argv;
}

yargs // eslint-disable-line
    // Disable locale detection
    .detectLocale(false)

    // Set help message.
    .usage(`${usageTemplate} <command>`)
    .help('help', 'print this message')
    .alias('?', 'help')
    .wrap(null)

    // Define error command
    .command({
        command: 'error [message]',
        describe: 'print error message and terminate the Node.js process with a non-zero exit code',
        builder: generateBuilder('error [message]'),
        handler({ message }) {
            if(message) {
                ora({ text: message }).start().fail();
            }

            exit(1);
        }
    })

    // Define create command
    .command({
        command: 'create <packages...>',
        describe: 'create new package(s) with package templates',
        builder: generateBuilder('create <packages...>'),
        handler: Bluebird.coroutine(function* handler({ packages }) {
            packages = packages.map(name => String(name).toLowerCase()); // eslint-disable-line

            function stringify(object) {
                return `${JSON.stringify(object, undefined, 4)}\n`;
            }

            let spinner;
            const result = [];

            const [
                cessairJSON, commonVersion, coreVersion, sourceTemplate, testTemplate, packageTemplate
            ] = yield Bluebird.all([
                readAsync('./packages/cessair/package.json', 'json'),
                readAsync('./packages/common/package.json', 'json').then(({ version }) => version),
                readAsync('./packages/core/package.json', 'json').then(({ version }) => version),
                readAsync('./templates/sources/index.js'),
                readAsync('./templates/tests/index.js'),
                readAsync('./templates/package.json', 'json')
            ]);

            for(const name of packages) {
                spinner = ora(`Begin to create ${name} package.`).start();

                const path = `./packages/${name}`;
                const existence = Boolean(yield existsAsync(path));

                if(existence) {
                    result.push(false);
                    spinner.fail(`Package ${name} is already exists.`);

                    continue; // eslint-disable-line
                }

                yield dirAsync(`${path}/sources`);

                const packageJSON = Object.assign({}, packageTemplate, {
                    name: `cessair-${name}`,
                    repository: packageTemplate.repository + name,
                    author: {
                        name: (yield execa('git', [ 'config', '--global', 'user.name' ])).stdout.trim(),
                        email: (yield execa('git', [ 'config', '--global', 'user.email' ])).stdout.trim()
                    },
                    dependencies: Object.assign({}, packageTemplate.dependencies, {
                        'cessair-common': `^${commonVersion}`,
                        'cessair-core': `^${coreVersion}`
                    })
                });

                cessairJSON.dependencies[`cessair-${name}`] = `^${packageJSON.version}`;

                cessairJSON.dependencies = Object.keys(cessairJSON.dependencies).sort().reduce((object, key) => {
                    object[key] = cessairJSON.dependencies[key]; // eslint-disable-line

                    return object;
                }, {});

                yield Bluebird.all([
                    [ `${path}/sources/index.js`, sourceTemplate ],
                    [ `${path}/tests/index.js`, testTemplate ],
                    [ `${path}/README.md`, `# Cessair - ${
                        name.length > 1 ? name[0].toUpperCase() + name.slice(1) : name.toUpperCase()
                    }` ],
                    [ `${path}/package.json`, stringify(packageJSON) ],
                    [ './packages/cessair/package.json', stringify(cessairJSON) ]
                ].map(args => writeAsync(...args)));

                result.push(true);
                spinner.succeed(`Package ${name} is initialized.`);
            }

            if(result.every(element => element)) {
                spinner = ora('Please wait to build.').start();

                yield execa('yarn', [ 'build' ]);

                spinner.succeed('Succeed to build.');
            }

            exit(0);
        })
    })

    // Define build command
    .command({
        command: 'build <packages...>',
        describe: 'build specified package(s)',
        builder: generateBuilder('build <packages...>\n\n  if you want to build totally, execute `yarn build`.'),
        handler: Bluebird.coroutine(function* handler({ packages }) {
            const spinner = ora().start('Begin to build partially');

            function catcher(error) {
                spinner.fail(error);
                output(error.stack);
                exit(1);
            }

            yield Bluebird.all(packages.map(name => (
                `lerna exec --scope ${
                    name === 'cessair' ? name : `cessair-${name}`
                } --loglevel silent -- yarn run build`
            ).split(' ')).map(([ command, ...args ]) => execa(command, args).then(({ stderr }) => {
                if(stderr) {
                    output({ stderr });
                }
            }).catch(catcher)));

            yield execa('lerna', [ 'bootstrap', '--loglevel', 'silent' ]).then(({ stderr }) => {
                if(stderr) {
                    output({ stderr });
                }
            }).catch(catcher);

            spinner.succeed('Succeed to build!');

            exit(0);
        })
    })

    // Define babelrc command
    .command({
        command: 'babelrc',
        describe: 'generate `.babelrc` optimized for current runtime',
        builder: generateBuilder('babelrc', yargs => (
            yargs.option('p', {
                alias: 'print',
                describe: 'print generated `.babelrc` to stdout and exit',
                default: false
            })
        )),
        handler: Bluebird.coroutine(function* handler({ print }) {
            function conditional(condition, plugin) {
                return semver.satisfies(version, condition) ? [ plugin ] : [];
            }

            const contexts = {
                'transform-async-generator-functions': 'async function* foo() { yield 1; await 2; }',
                'transform-decorators-legacy': 'function foo() {}; @foo\nclass Bar { }',
                'transform-class-properties': 'class Foo { bar = () => {} }',
                'transform-do-expressions': 'let foo = do { if(Math.random() >= 0.5) { true } else { false } }',
                'transform-function-bind': 'const foo = { bar() {} }; foo::bar()'
            };

            const babelrc = {
                plugins: [
                    // ES2015 Modules (Other features is already implemented on modern runtime)
                    [ 'transform-es2015-modules-commonjs', 'transform-export-extensions' ],

                    // Node.js v7.0.0 begin to support exponentiation operator.
                    conditional('<7.0.0', 'transform-exponentiation-operator'),

                    // Node.js v7.6.0 begin to support async function declaration.
                    conditional('<7.6.0', 'transform-async-to-generator'),

                    // Experimental features.
                    Object.keys(contexts).map(key => [ key, contexts[key] ]).filter(([ , context ]) => {
                        try {
                            eval(`(function() { ${context} })()`); // eslint-disable-line
                        } catch(error) {
                            return true;
                        }

                        return false;
                    }).map(([ plugin ]) => plugin),

                    // Node.js v8.3.0 begin to support object rest/spread syntax.
                    conditional('>=8.3.0', 'syntax-object-rest-spread'),
                    conditional('<8.3.0', 'transform-object-rest-spread'),

                    // Transform code generated by Babel to code dependents on its runtime.
                    [ [ 'transform-runtime', { polyfill: false, regenerator: false } ] ]
                ].reduce((plugins, block) => plugins.concat(block), [])
            };

            const generated = JSON.stringify(babelrc, undefined, 4);

            if(print) {
                output(generated);
            } else {
                yield writeAsync('.babelrc', `${generated}\n`);
            }

            exit(0);
        })
    })

    // Demand one command at least.
    .demandCommand(1, '')

    // Enable strict mode
    .strict()

    // Make argv
    .argv;
