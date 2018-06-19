export default function buildUsage(usageString, chain = yargs => yargs) {
    return yargs => chain(yargs.usage(`Usage:\n  node scripts ${usageString}`).help('help', 'print this message')).argv;
}
