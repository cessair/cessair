import { Type } from '@cessair/core';
import '@cessair/common';
import generic from '@cessair/generic';

const capableType = [ undefined, null, Function ];

Object.expands({
    /**
     * Execute **Object.freeze** in deeply.
     *
     * @param {*} object
     * @returns {*}
     **/
    glaciate(object) {
        Object.freeze(object);

        for (const key of Reflect.ownKeys(object)) {
            const property = object[key];

            if (typeof property !== 'object' || Object.isFrozen(property)) {
                continue;
            }

            Object.glaciate(property);
        }

        return object;
    },

    /**
     * Create structure definition as known as **data class of Kotlin** or **case class of Scala**.
     *
     * @param {*} schema
     * @param {*} [defaultValues]
     * @returns {(new (schema: *) => *) & { schema: * }}
     **/
    struct(schema, defaultValues = {}) {
        const [ entries, propertyKeys, values ] = [ Object.entries(schema), Object.keys(schema), Object.values(schema) ]; // eslint-disable-line max-len

        for (const [ propertyKey, value ] of entries) {
            if (Type.of(value).is(capableType)) {
                continue;
            }

            throw TypeError(`${propertyKey} is not capable for typing`);
        }

        for (const propertyKey of Object.keys(defaultValues)) {
            if (propertyKey in schema) {
                continue;
            }

            throw new ReferenceError(`${propertyKey} is not defined in schema`);
        }

        const source = propertyKeys
            .map(propertyKey => `${propertyKey} = #`)
            .join(', ')
            .split('#');

        const references = values;

        @generic(source, ...references)
        class Struct {
            static schema = Object.glaciate({ ...schema });

            constructor(initializer = {}) {
                for (const [ propertyKey, value ] of Object.entries(initializer)) {
                    const type = schema[propertyKey];

                    if (Type.of(value).is(type)) {
                        continue;
                    }

                    throw new TypeError(
                        `${propertyKey} ${String(value)} is not an instance of ${(type && type.name) || type}`
                    ); // eslint-disable-line max-len
                }

                const memory = new Map();

                // Pre-defining for keeping entries in the same order as declared in the schema.
                for (const propertyKey of propertyKeys) {
                    this[propertyKey] = undefined;
                }

                for (const [ propertyKey, value ] of Object.entries({ ...defaultValues, ...initializer })) {
                    memory.set(propertyKey, value);

                    this.expands(
                        {
                            get [propertyKey]() {
                                return memory.get(propertyKey);
                            },

                            set [propertyKey](value) {
                                const type = schema[propertyKey];

                                if (!Type.of(value).is(type)) {
                                    /* eslint-disable max-len */

                                    throw new TypeError(
                                        `${propertyKey}] ${String(value)} is not an instance of ${(type && type.name)
                                            || type}`
                                    );

                                    /* eslint-enable max-len */
                                }

                                memory.set(propertyKey, value);
                            }
                        },
                        true,
                        true
                    );
                }

                Object.glaciate(this);
            }
        }

        return Struct.$();
    }
});
