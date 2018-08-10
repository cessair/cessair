// Cessair core.
import { Type } from '@cessair/core';

// Internal extensions.
import { redefineContextName, AnyType } from './utilities';
import { typeHintedMap } from './type-hinting';

const overloadedMap = new WeakMap();

Function.expands({
    /**
     * Make overloaded function by given type information.
     *
     * @example
     * const numberOrString = Function.overload(overload => {
     *     overload(Number, x => x);
     *     overload(String, x => x)
     * });
     *
     * numberOrString(true); // will throw TypeError
     * numberOrString(1); // 1
     * numberOrString('1'); // '1';
     *
     * @param {...(Function|Function[])} ...types
     * @param {Function} describer
     * @returns {Function}
     **/
    overload(...args) {
        const [ contextName, describer ] = [ (args.length > 1 && args.shift()) || 'overloaded', args.pop() ];

        let otherwise = function overloaded() {
            throw new TypeError('Otherwise case is undefined');
        };

        const overloadedSet = new Set();

        /**
         * Register type hinting information to make overloaded function.
         *
         * @param {...(Function|Function[])} ...types
         * @param {Function} context
         * @returns {undefined}
         **/
        function delegate(...args) {
            const [ types, context ] = [ args.slice(0, -1), args.pop() ];

            if (!types.length) {
                if (!context) {
                    throw new TypeError('Type hinting information for overloading is empty');
                }

                if (!Type.of(context).is(Function)) {
                    throw new TypeError('Otherwise case context of overloading is not a function');
                }

                otherwise = context;

                return;
            }

            for (const type of types) {
                if (
                    (Array.isArray(type) && type.map(Type.of).every(type => type.is(AnyType)))
                    || Type.of(type).is(AnyType)
                ) {
                    continue;
                }

                throw new TypeError(`Type of ${type} is not undefined or null or function`);
            }

            if (!Type.of(context).is(Function)) {
                throw new TypeError(`${context} is not a function`);
            }

            context.expands(
                {
                    toString() {
                        return `function ${contextName}(${types
                            .map(
                                (type, index) => `$${index}: ${
                                    Array.isArray(type)
                                        ? type.map(type => `${!type ? type : type.name}`).join(' | ')
                                        : `${!type ? type : type.name}`
                                }`
                            )
                            .join(', ')}) { [overloaded function] }`;
                    }
                },
                false
            );

            overloadedSet.add({ types, context });
        }

        function overloaded(...args) {
            try {
                for (const { types, context } of overloadedSet) {
                    if (types.length !== args.length || types.some((type, index) => !Type.of(args[index]).is(type))) {
                        continue;
                    }

                    throw context;
                }

                throw otherwise;
            } catch (context) {
                return Reflect[new.target ? 'construct' : 'apply'](context, ...(new.target ? [ args ] : [ this, args ])); // eslint-disable-line max-len
            }
        }

        describer(delegate);

        for (const context of [ otherwise, overloaded ]) {
            redefineContextName(context, contextName);
        }

        overloaded.expands({
            toString() {
                return [ ...overloadedSet, { otherwise } ]
                    .map(
                        ({ types, otherwise }, index) => (otherwise
                            ? `function ${otherwise.name
                                      || 'otherwise'}() { [overloaded function : case otherwise] }`
                            : `function ${contextName}(${types
                                .map(
                                    (type, index) => `$${index}: ${
                                        Array.isArray(type)
                                            ? type.map(type => `${!type ? type : type.name}`).join(' | ')
                                            : `${!type ? type : type.name}`
                                    }`
                                )
                                .join(', ')}) { [overloaded function : case ${index}] }`)
                    )
                    .join('\n');
            }
        });

        overloadedMap.set(overloaded, delegate);

        return overloaded;
    }
});

Function.extends({
    /**
     * Overload already declared function.
     *
     * @example
     * const numberOrString = (x => x).typeHint(Number).overload(String, x => x);
     *
     * numberOrString(true); // will throw TypeError
     * numberOrString(1); // 1
     * numberOrString('1'); // '1';
     *
     * @param {...(Function|Function[])} ...types
     * @returns {Function}
     **/
    overload(...args) {
        switch (true) {
        case typeHintedMap.has(this): {
            const { types, context } = typeHintedMap.get(this);

            return Function.overload(context.name, overload => {
                overload(...args);
                overload(...types, context);
            });
        }

        case overloadedMap.has(this): {
            const delegate = overloadedMap.get(this);

            delegate(...args);

            return this;
        }

        default: {
            return Function.overload(this.name, overload => {
                overload(...args);
                overload(this);
            });
        }
        }
    }
});
