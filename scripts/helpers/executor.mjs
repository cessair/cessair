// Node.js built-in APIs.
import childProcess from 'child_process';
import { cwd, env } from 'process';

// Third-party modules.
import Promise from 'bluebird';

export default async function execute(command, options = {}) {
    const [ method, ...args ] = command.split(' ');
    const [ deferred, stdout, stderr ] = [ Promise.defer(), [], [] ];
    const process = childProcess.spawn(method, args, { cwd: cwd(), env, ...options });

    process.on('error', error => {
        deferred.reject(error);
    });

    process.on('exit', exitCode => {
        deferred[exitCode === 0 ? 'resolve' : 'reject']();
    });

    process.stdout.on('data', buffer => {
        stdout.push(buffer.toString('utf8'));
    });

    process.stderr.on('data', buffer => {
        stderr.push(buffer.toString('utf8'));
    });

    try {
        await deferred.promise;
    } catch(error) {
        if(error) {
            throw error;
        }

        return stderr.join('').trim();
    }

    return stdout.join('').trim();
}
