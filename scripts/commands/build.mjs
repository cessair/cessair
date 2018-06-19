// Node.js built-in APIs.
import { exit } from 'process';

// Helpers.
import execute from '../helpers/executor';
import indicate from '../helpers/indicator';
import buildUsage from '../helpers/usage-builder';

// Command artifacts.
export const command = 'build <packages...>';
export const describe = 'build specified package(s)';
export const builder = buildUsage(`${command}\n\n  if you want to build totally, execute \`npm run build\`.`); // eslint-disable-line max-len

export async function handler({ packages }) {
    const indicator = indicate('Begin to build partially');

    try {
        for (const name of packages) {
            await execute(`lerna exec --scope ${name === 'cessair' ? name : `@cessair/${name}`} -- npm run build`);
        }

        await execute('lerna bootstrap');
    } catch ({ message, code = 1 }) {
        indicator.fail(message);
        exit(code);
    }

    indicator.succeed('Succeed to build!');
}
