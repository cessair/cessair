// Source maps for ECMAScript modules.
require('source-map-support').install({ hookRequire: true });

// Third-party modules.
const yargs = require('yargs');

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
    .commandDir('commands')

    // Demand one command at least.
    .demandCommand(1, '')

    // Enable strict mode
    .strict()

    // Parse arguments.
    .parse();
