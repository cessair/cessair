// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

// Third-party modules.
import { promisify } from 'bluebird';

// Helpers.
import { shutdown } from '../helpers/indicator';
import buildUsage from '../helpers/usage-builder';

// Asynchronized functions.
const copyFile = promisify(fs.copyFile);

// Command artifacts.
export const command = 'generate-npmignore';
export const describe = 'generate `.npmignore` for publishing a package';
export const builder = buildUsage(command);

// Constants.
const sourcePath = path.resolve(__dirname, '../scaffolds/.npmignore');
const targetPath = path.resolve(cwd(), '.npmignore');

export async function handler() {
    try {
        await copyFile(sourcePath, targetPath);
    } catch (error) {
        shutdown(error);
    }
}
