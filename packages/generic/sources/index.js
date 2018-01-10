// Node.js built-in API.
import { deepStrictEqual } from 'assert';

// Type checking.
import { Type } from '@cessair/core';

// Compiler for generic type statements.
import lexicalAnalyze from './compiler/lexical-analyze';
import semanticAnalyze from './compiler/semantic-analyze';

const containerCache = new WeakMap();

// Passport for preventing to construct generic class in directly.
const genericPassport = Symbol('@cessair/generic::genericPassport');

function getHandler(typeInformation) {
    return {
        get(instance, key) {
            const property = instance[key];

            return Type.of(property).is(Function) ? new Proxy(property, {
                apply(target, thisArgument, args) {
                    return Reflect.apply(target, thisArgument, [ ...args, typeInformation ]);
                }
            }) : property;
        }
    };
}

/**
 * Make specific decorator to generalize a class.
 *
 * ---
 * @example
 * class Container { ... }
 *
 * const GenericContainer = generic`T : ${Number}`(Container);
 * const NumericContaienr = GenericContainer.$(Number);
 *
 * return new NumericContainer(...);
 *
 * @param {string[]} source
 * @param {...*} references
 * @returns {ClassDecorator}
 */
export default function generic(source, ...references) {
    const concatenated = source.join('#');
    const { tokens, identifiers } = lexicalAnalyze(concatenated);
    const deduceArguments = semanticAnalyze(concatenated, tokens, identifiers, references);

    return function decorate(Constructor) {
        const name = `${Constructor.name}<${concatenated}>`;

        class Container extends Constructor {
            /**
             * Wrap a class to use generic type definition.
             *
             * @param {symbol} passport
             * @param {*[]} args
             * @param {{ [genericType: string]: * }} typeInformation Instantiated type information.
             * @returns {Container}
             **/
            constructor(passport, args, typeInformation) {
                if(passport !== genericPassport) {
                    throw new TypeError(`Generic class constructor ${name} cannot be constructed without type arguments`); // eslint-disable-line max-len
                }

                super(...args, typeInformation);
            }

            /**
             * Instantiate generic class by type arguments.
             *
             * @param {...*} typeArguments
             * @returns {Container}
             **/
            static $(...typeArguments) {
                const typeInformation = deduceArguments( // eslint-disable-line function-paren-newline
                    typeArguments.length && (
                        typeArguments.map(Type.of).every(type => type.is([ undefined, null, Function ]))
                    ) ? typeArguments : typeArguments[0] || {}
                ); // eslint-disable-line function-paren-newline

                const instanceCache = containerCache.get(this);

                for(const { Instance, typeInformation: cachedArguments } of instanceCache) {
                    try {
                        deepStrictEqual(typeInformation, cachedArguments);
                    } catch(error) {
                        continue;
                    }

                    return Instance;
                }

                try {
                    class Instance extends this {
                        /**
                         * Construct a class with generic type information.
                         *
                         * @param {...*} args
                         * @returns {Instance}
                         */
                        constructor(...args) {
                            super(genericPassport, args, typeInformation);

                            return new Proxy(this, getHandler(typeInformation));
                        }

                        /**
                         * Define tag for `Object.prototype.toString`
                         *
                         * @returns {string}
                         **/
                        static [Symbol.toStringTag]() {
                            return this.name;
                        }
                    }

                    Instance.expands({ name: `${Constructor.name}<${Object.values(typeInformation).map(identifier => (
                        `${identifier && identifier.name}`
                    )).join(', ')}>` });

                    throw new Proxy(Instance, getHandler(typeInformation));
                } catch(Instance) {
                    instanceCache.add({ Instance, typeInformation });

                    return Instance;
                }
            }

            /**
             * Define tag for inherited property `Object.prototype.toString`.
             *
             * @returns {string}
             **/
            static [Symbol.toStringTag]() {
                return this.name;
            }
        }

        Container.expands({ name });
        containerCache.set(Container, new Set());

        return Container;
    };
}
