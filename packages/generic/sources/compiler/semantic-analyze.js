import { Type } from '@cessair/core';
import StateMachine from './state-machine';
import Token from './token';

const [ State, Constraint, Undeduced ] = [ {}, {}, Symbol('Undeduced') ];

for (const name of [
    'Start',
    'Identifier',
    'Extending',
    'ExtendingIdentifier',
    'ExtendingConjuction',
    'DefaultValue',
    'End'
]) {
    State[name] = Symbol(name);
}

for (const name of [ 'Any', 'Primitive', 'Complex' ]) {
    Constraint[name] = Symbol(name);
}

function assertIdentifier(constraint, typeParameters, identifier) {
    if (!typeParameters[identifier]) {
        throw new ReferenceError(`Identifier '${identifier}' does not declared`);
    }

    if (constraint !== Constraint.Any && constraint !== typeParameters[identifier].constraint) {
        throw new TypeError(`Constraint of type parameter ${identifier} is not ${
            constraint === Constraint.Primitive ? 'primitive' : 'complex'
        }`);
    }
}

function assertReference(constraint, reference) {
    if (!Type.of(reference).is([ undefined, null, Function ])) {
        throw new TypeError(`Reference '${reference}' is not referenceable`);
    }

    const primitiveness = [ undefined, null, Boolean, Symbol, Number, String ].some(item =>
        item === reference ||
            (item &&
                ((reference !== Function && reference !== Object && item instanceof reference) ||
                    item.isPrototypeOf(reference))));

    if (constraint === Constraint.Primitive && !primitiveness) {
        throw new TypeError('Primitive constraint able to extend undefined, null, Boolean, Symbol, Number, String');
    }

    if (constraint === Constraint.Complex && primitiveness) {
        throw new TypeError('Complex constraint unable to extend undefined, null, Boolean, Symbol, Number, String');
    }
}

export default function semanticAnalyze(source, tokens, identifiers, references) {
    const typeParameters = {};

    StateMachine.execute({
        initialState: State.Start,
        sharedStorage: { position: 0, maximum: tokens.length, typeParameter: null },
        completionCondition: ({ position, maximum }) => position >= maximum,

        beforeEach(sharedStorage) {
            const { position } = sharedStorage;
            const [ current, next ] = [ tokens[position], tokens[position + 1] ];
            const [ currentType, nextType ] = [ current, next ].map(Type.of);

            Object.assign(sharedStorage, { current, next, currentType, nextType });
        },

        afterEach(sharedStorage) {
            Object.assign(sharedStorage, { position: sharedStorage.position + 1 });
        },

        [State.Start](sharedStorage) {
            let { typeParameter } = sharedStorage;
            const { position, current, currentType, nextType } = sharedStorage;

            if (typeParameter && typeParameter.identifier) {
                typeParameters[typeParameter.identifier] = typeParameter;
            }

            typeParameter = new Proxy(
                {
                    constraint: Constraint.Any,
                    value: Undeduced,

                    extending: new Proxy([], {
                        get(target, index) {
                            return Type.of(target[index]).is(String)
                                ? typeParameters[target[index]].value
                                : target[index];
                        }
                    })
                },
                {
                    get(target, property) {
                        return property === 'value' && Type.of(target.value).is(String)
                            ? typeParameters[target.value].value
                            : target[property];
                    }
                }
            );

            Object.assign(sharedStorage, { typeParameter });

            if (
                !currentType.is([ Token.Start, Token.ConjunctionNext, Token.End ]) ||
                (currentType.is(Token.ConjunctionNext) && nextType.is(Token.End))
            ) {
                throw new SyntaxError(`Unexpected token ${source.slice(current.start, current.end)}`);
            }

            if (currentType.is(Token.Start) && nextType.is(Token.End)) {
                return State.End;
            }

            switch (nextType[Object.getOwnPropertySymbols(nextType)[0]]) {
            case Token.ConstraintPrimitive: {
                typeParameter.constraint = Constraint.Primitive;

                Object.assign(sharedStorage, { position: position + 1 });

                break;
            }

            case Token.ConstraintComplex: {
                typeParameter.constraint = Constraint.Complex;

                Object.assign(sharedStorage, { position: position + 1 });
                break;
            }

            default:
                break;
            }

            return State.Identifier;
        },

        [State.Identifier]({ position, typeParameter, current, next, currentType, nextType }) {
            if (!currentType.is(Token.Identifier)) {
                throw new SyntaxError(`Unexpected token ${source.slice(current.start, current.end)}`);
            }

            const identifier = identifiers[position];

            if (typeParameters[identifier]) {
                throw new ReferenceError(`Identifier '${identifier}' has already been declared`);
            }

            Object.assign(typeParameter, { identifier });

            switch (nextType[Object.getOwnPropertySymbols(nextType)[0]]) {
            case Token.Extends: {
                return State.Extending;
            }

            case Token.Substitution: {
                return State.DefaultValue;
            }

            case Token.ConjunctionNext: {
                return State.Start;
            }

            case Token.ConjunctionOr: {
                return State.ExtendingIdentifier;
            }

            case Token.End: {
                return State.End;
            }

            default:
                break;
            }

            throw new SyntaxError(`Unexpected token ${source.slice(next.start, next.end)}`);
        },

        [State.Extending]({ current, currentType }) {
            if (!currentType.is(Token.Extends)) {
                throw new SyntaxError(`Unexpected token ${source.slice(current.start, current.end)}`);
            }

            return State.ExtendingIdentifier;
        },

        [State.ExtendingIdentifier]({ position, typeParameter, current, next, currentType, nextType }) {
            const { constraint, extending } = typeParameter;

            switch (currentType[Object.getOwnPropertySymbols(currentType)[0]]) {
            case Token.Identifier: {
                const identifier = identifiers[position];

                assertIdentifier(constraint, typeParameters, identifier);
                extending.push(identifier);

                break;
            }

            case Token.Reference: {
                if (!references.length) {
                    throw new ReferenceError(`Unexpected token ${source.slice(current.start, current.end)}`);
                }

                const reference = references.shift();

                assertReference(constraint, reference);
                extending.push(reference);

                break;
            }

            default: {
                throw new SyntaxError(`Unexpected token ${source.slice(current.start, current.end)}`);
            }
            }

            switch (nextType[Object.getOwnPropertySymbols(nextType)[0]]) {
            case Token.ConjunctionNext: {
                return State.Start;
            }

            case Token.Substitution: {
                return State.DefaultValue;
            }

            case Token.ConjunctionOr: {
                return State.ExtendingConjuction;
            }

            case Token.End: {
                return State.End;
            }

            default:
                break;
            }

            throw new SyntaxError(`Unexpected token ${source.slice(next.start, next.end)}`);
        },

        [State.ExtendingConjuction]({ current, currentType }) {
            if (!currentType.is(Token.ConjunctionOr)) {
                throw new SyntaxError(`Unexpected token ${source.slice(current.start, current.end)}`);
            }

            return State.ExtendingIdentifier;
        },

        [State.DefaultValue](sharedStorage) {
            const { position, typeParameter, current, next, currentType, nextType } = sharedStorage;

            if (!currentType.is(Token.Substitution)) {
                throw new SyntaxError(`Unexpected token ${source.slice(current.start, current.end)}`);
            }

            const { constraint } = typeParameter;

            switch (nextType[Object.getOwnPropertySymbols(nextType)[0]]) {
            case Token.Identifier: {
                const identifier = identifiers[position + 1];

                assertIdentifier(constraint, typeParameters, identifier);
                Object.assign(typeParameter, { value: identifier });

                break;
            }

            case Token.Reference: {
                if (!references.length) {
                    throw new ReferenceError(`Unexpected token ${source.slice(current.start, current.end)}`);
                }

                const reference = references.shift();

                assertReference(constraint, reference);
                Object.assign(typeParameter, { value: reference });

                break;
            }

            default: {
                throw new SyntaxError(`Unexpected token ${source.slice(next.start, next.end)}`);
            }
            }

            Object.assign(sharedStorage, { position: position + 1 });

            return State.Start;
        },

        [State.End]({ typeParameter }) {
            if (typeParameter && typeParameter.identifier) {
                typeParameters[typeParameter.identifier] = typeParameter;
            }
        }
    });

    return function deduceArguments(typeArguments) {
        let candidates = {};

        if (Array.isArray(typeArguments)) {
            const identifiers = Object.keys(typeParameters);

            for (const [ index, argument ] of Object.entries(typeArguments)) {
                candidates[identifiers[index]] = argument;
            }
        } else {
            candidates = typeArguments;
        }

        for (const [ identifier, candidate ] of Object.entries(candidates)) {
            const parameter = typeParameters[identifier];
            const { constraint, extending } = parameter;

            assertIdentifier(constraint, typeParameters, identifier);
            assertReference(constraint, candidate);

            if (extending.length && !Type.from(candidate).is(extending)) {
                throw new TypeError(`Type parameter '${identifier}' have to be ${extending
                    .map(parameter => `${parameter && parameter.name}`)
                    .join(' or ')}`);
            }

            parameter.value = candidate;
        }

        const deducedArguments = function validateArguments(...pairs) {
            for (const [ argument, type ] of pairs) {
                if (!Type.of(argument).is(type)) {
                    throw new TypeError(`${argument} is not ${type && type.name}`);
                }
            }
        };

        for (const [ identifier, { value } ] of Object.entries(typeParameters)) {
            if (value === Undeduced) {
                throw new TypeError(`Type parameter '${identifier}' is not deduced`);
            }

            deducedArguments[identifier] = value;
        }

        return Object.freeze(deducedArguments);
    };
}
