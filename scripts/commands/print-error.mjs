// Node.js built-in APIs.
import { exit } from 'process';

// Helpers.
import { shutdown } from '../helpers/indicator';
import buildUsage from '../helpers/usage-builder';

// Command artifacts.
export const command = 'print-error [message]';
export const describe = 'print error message and terminate the Node.js process with a non-zero exit code';
export const builder = buildUsage(command);

export function handler({ message }) {
    shutdown(message);
    exit(1);
}
