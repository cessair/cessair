const tokenTable = new Map();

export default class Token {
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;

        Object.freeze(this);
    }

    static register(name) {
        if(tokenTable.has(name)) {
            return tokenTable.get(name);
        }

        tokenTable.set(name, class extends Token {
            constructor(start, end) {
                super(name, start, end);
            }
        });

        Token.enlarge({
            get [name]() {
                return tokenTable.get(name);
            }
        });

        return undefined;
    }
}

for(const name of [
    'Start', 'End', 'ConstraintPrimitive', 'ConstraintComplex', 'Extends', 'Substitution', 'Reference',
    'ConjunctionNext', 'ConjunctionOr', 'Identifier'
]) {
    Token.register(name);
}
