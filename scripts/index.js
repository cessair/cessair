// Source maps for ECMAScript modules.
require('source-map-support').install({ hookRequire: true });

// Node.js built-in APIs.
const fs = require('fs');
const path = require('path');

// Third-party modules.
const babel = require('@babel/core');
const yargs = require('yargs');

// Constants.
const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.babelrc'), 'utf8'));

// Temporal resolver for ECMAScript modules until proposal becomes staged.
require.extensions['.mjs'] = function resolveESM(module, filename) {
    const { code } = babel.transformFileSync(filename, { sourceMaps: 'inline', ...babelrc });

    return module._compile(code, filename); // eslint-disable-line no-underscore-dangle
};

// Command line interface.
yargs

    // Disable locale detection
    .detectLocale(false)

    // Set help message.
    .usage('Usage:\n  node scripts <command>')
    .help('help', 'print this message')
    .alias('?', 'help')
    .wrap(null)

    // Defines commands.
    .commandDir('commands', { extensions: [ 'js', 'mjs' ] })

    // Demand one command at least.
    .demandCommand(1, '')

    // Enable strict mode
    .strict()

    // Parse arguments.
    .parse();
