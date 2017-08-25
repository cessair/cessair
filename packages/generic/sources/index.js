import { deepStrictEqual } from 'assert';
import { Type } from '@cessair/core';
import lexicalAnalyze from './compiler/lexical-analyze';
import semanticAnalyze from './compiler/semantic-analyze';

const containerCache = new WeakMap();
const Generic = Symbol('Generic');

function getHandler(deducedArguments) {
    return {
        get(instance, key) {
            const property = instance[key];

            return Type.of(property).is(Function) ? new Proxy(property, {
                apply(target, thisArgument, args) {
                    return Reflect.apply(target, thisArgument, [ ...args, deducedArguments ]);
                }
            }) : property;
        }
    };
}

export default function generic(source, ...references) {
    const concatenated = source.join('#');
    const { tokens, identifiers } = lexicalAnalyze(concatenated);
    const deduceArguments = semanticAnalyze(concatenated, tokens, identifiers, references);

    return function decorate(Constructor) {
        const name = `${Constructor.name}<${concatenated}>`;

        class Container extends Constructor {
            constructor(generic, args, deducedArguments) {
                if(generic !== Generic) {
                    throw new TypeError(
                        `Generic class constructor ${name} cannot be constructed without type arguments`
                    );
                }

                super(...args, deducedArguments);
            }

            static $(...typeArguments) {
                const deducedArguments = deduceArguments(
                    typeArguments.length && (
                        typeArguments.map(Type.of).every(type => type.is([ undefined, null, Function ]))
                    ) ? typeArguments : typeArguments[0] || {}
                );

                const instanceCache = containerCache.get(this);

                for(const { Instance, deducedArguments: cachedArguments } of instanceCache) {
                    try {
                        deepStrictEqual(deducedArguments, cachedArguments);
                    } catch(error) {
                        continue;
                    }

                    return Instance;
                }

                try {
                    class Instance extends this {
                        constructor(...args) {
                            super(Generic, args, deducedArguments);

                            return new Proxy(this, getHandler(deducedArguments));
                        }

                        static [Symbol.toStringTag]() {
                            return this.name;
                        }
                    }

                    Instance.enlarge({ name: `${Constructor.name}<${Object.values(deducedArguments).map(identifier => (
                        `${identifier && identifier.name}`
                    )).join(', ')}>` });

                    throw new Proxy(Instance, getHandler(deducedArguments));
                } catch(Instance) {
                    instanceCache.add({ Instance, deducedArguments });

                    return Instance;
                }
            }

            static [Symbol.toStringTag]() {
                return this.name;
            }
        }

        Container.enlarge({ name });
        containerCache.set(Container, new Set());

        return Container;
    };
}
