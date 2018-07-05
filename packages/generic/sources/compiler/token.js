import '@cessair/core';

const tokenTable = new Map();

export default class Token {
    constructor(start, end) {
        this.expands({ start, end });

        Object.freeze(this);
    }

    static register(name) {
        if (tokenTable.has(name)) {
            return tokenTable.get(name);
        }

        class SubToken extends Token {}

        SubToken.expands({ name: `Token<${name}>` });
        tokenTable.set(name, SubToken);

        Token.expands({
            get [name]() {
                return tokenTable.get(name);
            }
        });

        return undefined;
    }
}

for (const name of [
    'Start',
    'End',
    'ConstraintPrimitive',
    'ConstraintComplex',
    'Extends',
    'Substitution',
    'Reference',
    'ConjunctionNext',
    'ConjunctionOr',
    'Identifier'
]) {
    Token.register(name);
}
