// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';
import { cwd, stdout } from 'process';

// Third-party modules.
import { Promise, promisify } from 'bluebird';

// Helpers.
import { shutdown } from '../helpers/indicator';
import buildUsage from '../helpers/usage-builder';

// Asynchronized functions.
const copyFile = promisify(fs.copyFile);

// Command artifacts.
export const command = 'generate-babelrc';
export const describe = 'generate `.babelrc` optimized for current runtime';

export const builder = buildUsage(command, yargs =>
    yargs.option('p', {
        alias: 'print',
        describe: 'print generated `.babelrc` to stdout and exit',
        default: false
    }));

// Constants.
const sourcePath = path.resolve(__dirname, '../scaffolds/.babelrc');
const targetPath = path.resolve(cwd(), '.babelrc');

export async function handler({ print }) {
    if (print) {
        const deferred = Promise.defer();
        const readStream = fs.createReadStream(sourcePath);

        readStream.on('error', error => deferred.reject(error));
        readStream.on('end', () => deferred.resolve());
        readStream.pipe(stdout);

        try {
            await deferred.promise;
        } catch (error) {
            shutdown(error);
        }

        return;
    }

    try {
        await copyFile(sourcePath, targetPath);
    } catch (error) {
        shutdown(error);
    }
}
