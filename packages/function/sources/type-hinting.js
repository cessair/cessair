// Cessair core.
import { Type } from '@cessair/core';

// Internal extensions.
import { redefineContextName, AnyType } from './utilities';

export const typeHintedMap = new WeakMap(); // eslint-disable-line import/prefer-default-export

Function.expands({
    /**
     * Make type-hinted function by given type information.
     *
     * @example
     * const numberOnly = Function.typeHint(Number, x => x);
     *
     * numberOnly('1'); // will throw TypeError
     * numberOnly(1); // 1
     *
     * @param {...(Function|Function[])} types
     * @param {Function} context
     * @returns {Function}
     **/
    typeHint(...args) {
        const [ types, context ] = [ args.slice(0, -1), args.pop() ];
        const [ length, contextName ] = [ types.length, context.name || 'anonymous' ];

        if (!length) {
            throw new TypeError('Type hinting information is empty');
        }

        if (!Type.of(context).is(Function)) {
            throw new TypeError(`${context} is not a function`);
        }

        for (const type of types) {
            if (
                (Array.isArray(type) && type.map(Type.of).every(type => type.is(AnyType))) ||
                Type.of(type).is(AnyType)
            ) {
                continue;
            }

            throw new TypeError(`Type of ${type} is not undefined or null or function`);
        }

        if (!Type.of(context).is(Function)) {
            throw new TypeError(`${context} is not a function`);
        }

        const typeHinted = function typeHinted(...args) {
            if (args.length < length) {
                throw new TypeError(`${contextName} requires ${length} argument${length > 1 ? 's' : ''} at least`);
            }

            for (const [ index, argument ] of args.slice(0, length).map((argument, index) => [ index, argument ])) {
                const type = types[index];

                if (
                    (Array.isArray(type) && type.some(type => Type.of(argument).is(type))) ||
                    Type.of(argument).is(type)
                ) {
                    continue;
                }

                /* eslint-disable max-len */

                throw new TypeError(`${index + 1 + [ 'st', 'nd', 'rd' ][index % 10] || 'th'} argument have to be an instance of ${
                    Array.isArray(type)
                        ? type.map(type => (!type && `${type}`) || type.name).join(' or ')
                        : (!type && `${type}`) || type.name
                }`);

                /* eslint-enable max-len */
            }

            return Reflect[new.target ? 'construct' : 'apply'](context, ...(new.target ? [ args ] : [ this, args ]));
        };

        redefineContextName(typeHinted, contextName);

        typeHinted.expands({
            toString() {
                return `function ${contextName}(${types
                    .map((type, index) =>
                        `$${index}: ${
                            Array.isArray(type)
                                ? type.map(type => `${!type ? type : type.name}`).join(' | ')
                                : `${!type ? type : type.name}`
                        }`)
                    .join(', ')}) { [type hinted function] }`;
            }
        });

        typeHintedMap.set(typeHinted, { types, context });

        return typeHinted;
    }
});

Function.extends({
    /**
     * Attach type information to already declared function.
     *
     * @example
     * const numberOnly = (x => x).typeHint(Number);
     *
     * numberOnly('1'); // will throw TypeError
     * numberOnly(1); // 1
     *
     * @param {...(Function|Function[])} types
     * @returns {Function}
     **/
    typeHint(...types) {
        return Function.typeHint(...types, typeHintedMap.has(this) ? typeHintedMap.get(this).context : this);
    }
});
