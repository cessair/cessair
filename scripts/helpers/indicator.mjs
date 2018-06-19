// Node.js built-in APIs.
import { exit, stdout } from 'process';

// Third-party modules.
import ora from 'ora';

export default function indicate(message) {
    return ora({ text: message || '' }).start();
}

export function shutdown(errorOrMessage, exitCode = 1) {
    if(exitCode === 0) {
        stdout.write(errorOrMessage);
    } else if(errorOrMessage) {
        indicate().fail(errorOrMessage instanceof Error ? errorOrMessage.stack : errorOrMessage);
    }

    exit(exitCode);
}
