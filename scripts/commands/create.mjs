// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';

// Third-party modules.
import { Promise, promisify } from 'bluebird';

// Helpers.
import execute from '../helpers/executor';
import indicate, { shutdown } from '../helpers/indicator';
import buildUsage from '../helpers/usage-builder';

// Information of essential packages.
import cessairPackage from '../../packages/cessair/package.json';
import { version as coreVersion } from '../../packages/core/package.json';
import { version as commonVersion } from '../../packages/common/package.json';
import scaffoldPackage from '../scaffolds/package.json';
import { devDependencies } from '../../lerna.json';

// Asynchronized functions.
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const access = promisify(fs.access);

// Command artifacts.
export const command = 'create <packages...>';
export const describe = 'create new package(s) with prepared scaffolds';
export const builder = buildUsage(command);

export async function handler({ packages }) {
    const results = [];
    let [ indicator, userName, userEmail ] = [];

    try {
        [ userName, userEmail ] = await Promise.map([ 'name', 'email' ], key => execute(`git config --global user.${key}`)); // eslint-disable-line max-len
    } catch (error) {
        shutdown(error);
    }

    for (const packageName of packages) {
        const name = String(packageName).toLowerCase();
        const target = path.resolve(__dirname, '../../packages', name);

        indicator = indicate(`Attempt to create \`@cessair/${name}\` package.`);

        try {
            await access(target, fs.constants.F_OK);

            results.push(false);
            indicator.fail(`\`@cessair/${name}\` package is already created.`);

            continue;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        try {
            await mkdir(target);

            for (const directory of [ 'sources', 'tests' ]) {
                const resolvedPath = path.resolve(target, directory);

                await mkdir(resolvedPath);

                await copyFile(
                    path.resolve(__dirname, '../scaffolds', directory, 'index.js'),
                    path.resolve(resolvedPath, 'index.js')
                );
            }
        } catch (error) {
            shutdown(error);
        }

        const packageJSON = {
            ...scaffoldPackage,

            name: `@cessair/${name}`,
            repository: scaffoldPackage.repository + name,
            author: { name: userName, email: userEmail },

            dependencies: {
                ...scaffoldPackage.dependencies,

                '@cessair/common': `^${commonVersion}`,
                '@cessair/core': `^${coreVersion}`
            },

            devDependencies
        };

        cessairPackage.dependencies[`@cessair/${name}`] = `^${packageJSON.version}`;

        try {
            await writeFile(
                path.resolve(target, 'README.md'),
                `${[
                    `# @cessair/${name}\n> Description`,
                    '- [License](#license)',
                    '## License\n[MIT License](https://github.com/cessair/cessair/blob/develop/LICENSE).'
                ].join('\n\n')}\n`
            );

            await writeFile(path.resolve(target, 'package.json'), `${JSON.stringify(packageJSON, undefined, 4)}\n`);
        } catch (error) {
            shutdown(error);
        }

        results.push(true);
        indicator.succeed(`\`@cessair/${name}\` package is created.`);
    }

    try {
        await writeFile(
            require.resolve('../../packages/cessair/package'),
            `${JSON.stringify(cessairPackage, undefined, 4)}\n`
        );
    } catch (error) {
        shutdown(error);
    }

    if (!results.every(result => result)) {
        shutdown();
    }

    indicator = indicate('Attempt to build');

    try {
        await execute('npm run build');
    } catch (error) {
        shutdown(error);
    }

    indicator.succeed('Succeed to build.');
}
