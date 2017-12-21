import { deepStrictEqual } from 'assert';
import Token from './token';

export default function lexicalAnalyze(source) {
    let position;
    let identifier = [];
    const blocks = source.replace(/\s+/g, ' ').trim().split('').map(character => character.codePointAt(0));
    const maximum = blocks.length;
    const [ tokens, identifiers ] = [ [ new Token.Start(0, 0) ], {} ];

    function identifierTokenize() {
        if(identifier.length) {
            const identifierString = String.fromCodePoint(...identifier);

            identifiers[tokens.push(new Token.Identifier(position - identifier.length, position)) - 1] = identifierString; // eslint-disable-line max-len

            identifier = [];
        }
    }

    function tokenize(block, Token, additionalAction = () => {}) {
        const size = block.length;
        const [ read, target ] = [ blocks.slice(position, position + size), [ ...block ] ];

        try {
            deepStrictEqual(read, target);
        } catch(error) {
            return false;
        }

        identifierTokenize();

        if(Token) {
            tokens.push(new Token(position, position + size));
        }

        additionalAction();

        position += size - 1;

        return true;
    }

    for(position = 0; position < maximum; position += 1) {
        if(
            tokenize([ 32 ]) ||

            tokenize([ 92, 35 ], undefined, () => {
                identifiers[tokens.push(new Token.Identifier(position, position + 2)) - 1] = '\\#';
            }) ||

            tokenize([ 35 ], Token.Reference) ||
            tokenize([ 44 ], Token.ConjunctionNext) ||
            tokenize([ 58 ], Token.Extends) ||
            tokenize([ 61 ], Token.Substitution) ||
            tokenize([ 124 ], Token.ConjunctionOr) ||
            tokenize([ 112, 114, 105, 109, 105, 116, 105, 118, 101, 32 ], Token.ConstraintPrimitive) ||
            tokenize([ 99, 111, 109, 112, 108, 101, 120, 32 ], Token.ConstraintComplex) ||
            tokenize([ 101, 120, 116, 101, 110, 100, 115, 32 ], Token.Extends)
        ) {
            continue;
        }

        identifier.push(blocks[position]);
    }

    identifierTokenize();
    tokens.push(new Token.End(maximum, maximum));

    return { tokens, identifiers };
}
