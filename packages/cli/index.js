#!/usr/bin/env node

/**
 * The CLI tool for Cessair package development.
 * This code have to ensure to work on Node.js v8.9.3+ without Babel.
 **/

// Node.js built-in API.
const { exit, stderr, stdout } = require('process');

// Third-party modules.
const execa = require('execa');

const {
    dirAsync: makeDirectory,
    existsAsync: exists,
    readAsync: readFile,
    writeAsync: writeFile
} = require('fs-jetpack');

const ora = require('ora');
const yargs = require('yargs');

const usageTemplate = 'Usage:\n  cessair';

function execute(target, options = {}) {
    const [ command, ...args ] = target.split(' ');

    return execa(command, args, options);
}

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
    return yargs => chain( // eslint-disable-line function-paren-newline
        yargs
            .usage(`${usageTemplate} ${usageString}`)
            .help('help', 'print this message')
    ).argv; // eslint-disable-line function-paren-newline
}

yargs // eslint-disable-line no-unused-expressions

    // Disable locale detection
    .detectLocale(false)

    // Set help message.
    .usage(`${usageTemplate} <command>`)
    .help('help', 'print this message')
    .alias('?', 'help')
    .wrap(null)

    // Define `print-error` command
    .command({
        command: 'print-error [message]',
        describe: 'print error message and terminate the Node.js process with a non-zero exit code',
        builder: generateBuilder('print-error [message]'),

        handler({ message }) {
            if(message) {
                ora({ text: message }).start().fail();
            }

            exit(1);
        }
    })

    // Define `create-package` command
    .command({
        command: 'create-package <packages...>',
        describe: 'create new package(s) with package templates',
        builder: generateBuilder('create-package <packages...>'),

        async handler({ packages }) {
            packages = packages.map(name => String(name).toLowerCase()); // eslint-disable-line

            function stringify(object) {
                return `${JSON.stringify(object, undefined, 4)}\n`;
            }

            let spinner;
            const result = [];

            const [
                cessairJSON, sourceTemplate, testTemplate, packageTemplate
            ] = await Promise.all([
                './packages/cessair/package.json',
                './scaffolds/sources/index.js',
                './scaffolds/tests/index.js',
                './scaffolds/package.json'
            ].map(path => (
                /\.json$/.test(path) ? [ path, 'json' ] : [ path ]
            )).map(args => readFile(...args)));

            const [
                buildingVersion, cliVersion, commonVersion, coreVersion
            ] = await Promise.all([
                './packages/building/package.json',
                './packages/cli/package.json',
                './packages/common/package.json',
                './packages/core/package.json'
            ].map(path => readFile(path, 'json').then(({
                version
            }) => version)));

            for(const name of packages) {
                spinner = ora(`Begin to create ${name} package.`).start();

                const path = `./packages/${name}`;
                const existence = Boolean(await exists(path));

                if(existence) {
                    result.push(false);
                    spinner.fail(`Package ${name} is already exists.`);

                    continue; // eslint-disable-line
                }

                await makeDirectory(`${path}/sources`);

                const packageJSON = {
                    ...packageTemplate,

                    name: `@cessair/${name}`,
                    repository: packageTemplate.repository + name,

                    author: {
                        name: (await execute('git config --global user.name')).stdout.trim(),
                        email: (await execute('git config --global user.email')).stdout.trim()
                    },

                    dependencies: {
                        ...packageTemplate.dependencies,

                        '@cessair/common': `^${commonVersion}`,
                        '@cessair/core': `^${coreVersion}`
                    },

                    devDependencies: {
                        ...packageTemplate.devDependencies,

                        '@cessair/building': `^${buildingVersion}`,
                        '@cessair/cli': `^${cliVersion}`
                    }
                };

                cessairJSON.dependencies[`@cessair/${name}`] = `^${packageJSON.version}`;

                cessairJSON.dependencies = Object.keys(cessairJSON.dependencies).sort().reduce((object, key) => {
                    object[key] = cessairJSON.dependencies[key]; // eslint-disable-line

                    return object;
                }, {});

                await Promise.all([
                    [ `${path}/sources/index.js`, sourceTemplate ],
                    [ `${path}/tests/index.js`, testTemplate ],

                    [ `${path}/README.md`, `${[
                        `# @cessair/${name}`,
                        '> Description',
                        '- [License](#license)',
                        '## License',
                        '[MIT License](https://github.com/cessair/cessair/blob/develop/LICENSE).'
                    ].join('\n\n')}\n` ],

                    [ `${path}/package.json`, stringify(packageJSON) ],
                    [ './packages/cessair/package.json', stringify(cessairJSON) ]
                ].map(args => writeFile(...args)));

                result.push(true);
                spinner.succeed(`Package ${name} is initialized.`);
            }

            if(result.every(element => element)) {
                spinner = ora('Please wait to build.').start();

                await execute('npm run build');

                spinner.succeed('Succeed to build.');
            }

            exit(0);
        }
    })

    // Define `build` command
    .command({
        command: 'build <packages...>',
        describe: 'build specified package(s)',

        builder: generateBuilder('build <packages...>\n\n  if you want to build totally, execute `npm run build`.'), // eslint-disable-line max-len

        async handler({ packages }) {
            const spinner = ora().start('Begin to build partially');

            function catcher(error) {
                spinner.fail(error.message);
                exit(error.code);
            }

            await Promise.all(packages.map(name => (
                `lerna exec --scope ${
                    name === 'cessair' ? name : `@cessair/${name}`
                } -- npm run build`
            )).map(target => execute(target).catch(catcher)));

            await execute('lerna bootstrap').catch(catcher);

            spinner.succeed('Succeed to build!');
            exit(0);
        }
    })

    // Define `generate-npmignore` command
    .command({
        command: 'generate-npmignore',
        describe: 'generate `.npmignore` for publishing a package',
        builder: generateBuilder('generate-babelrc'),

        async handler() {
            const generated = Object.entries({
                sources: 'Original contents',
                '!releases': 'Released contents',
                tests: 'Unit tests'
            }).map(([ globPattern, description ]) => `# ${description}\n${globPattern}`).join('\n\n');

            await writeFile('.npmignore', `${generated}\n`);

            exit(0);
        }
    })

    // Define `generate-babelrc` command
    .command({
        command: 'generate-babelrc',
        describe: 'generate `.babelrc` optimized for current runtime',

        builder: generateBuilder('generate-babelrc', yargs => (
            yargs.option('p', {
                alias: 'print',
                describe: 'print generated `.babelrc` to stdout and exit',
                default: false
            })
        )),

        async handler({ print }) {
            const babelrc = {
                presets: [ [ 'env', { targets: { node: 'current' } } ] ],
                plugins: [
                    // Support for `async function* asyncGenerator() {}`.
                    'transform-async-generator-functions',

                    // Support for `export module from 'module';`.
                    // Support for `export * from 'module';`.
                    'transform-export-extensions',

                    // Support for `const x = do { if(y) { 1 } else { 2 } };`.
                    'transform-do-expressions',

                    // Support for `return ::console.log;`.
                    // Avoid for `return console.log.bind(console);`.
                    'transform-function-bind',

                    // Support for `const { x, y, ...z } = object;`.
                    'transform-object-rest-spread',

                    // Order of below two plugins is important.
                    'transform-decorators-legacy',
                    [ 'transform-class-properties', { spec: true } ],

                    // Transform native async/await syntax to `Bluebird.coroutine`.
                    // It is twice faster and twice more efficient than native one.
                    [ 'transform-async-to-generator', { module: 'bluebird', method: 'coroutine' } ],

                    // Transform code generated by Babel to code dependents on its runtime.
                    [ 'transform-runtime', { polyfill: false, regenerator: false, useBuiltIns: true } ]
                ]
            };

            const generated = JSON.stringify(babelrc, undefined, 4);

            if(print) {
                output(generated);
            } else {
                await writeFile('.babelrc', `${generated}\n`);
            }

            exit(0);
        }
    })

    // Demand one command at least.
    .demandCommand(1, '')

    // Enable strict mode
    .strict()

    // Make argv
    .argv;
