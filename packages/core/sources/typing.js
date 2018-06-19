const cache = new WeakMap();
const fallback = { undefined() {}, null() {} };
const typeCapsule = Symbol('@cessair/core::typeCapsule');

/**
 * Check incapability of target.
 *
 * @param {*} target
 * @returns {boolean}
 **/
function checkIncapability(target) {
    return target !== undefined && target !== null && typeof target !== 'function';
}

/**
 * Compare `source` and `target` by its relationship like prototype inheritance chain.
 *
 * @param {*} source
 * @param {*} target
 * @returns {boolean}
 **/
function compareByRelation(source, target) {
    // Test direct ancestor or undefined or null.
    if (source === target) {
        return true;
    }

    // Test target is neither undefined nor null.
    if (!target) {
        return false;
    }

    // If this statement is true, target is Object.
    // Because, every instance of JavaScript is an object.
    if (target !== Function && source instanceof target) {
        return true;
    }

    // Test inheritance hierarchy from prototype chain.
    if (target.isPrototypeOf(source)) {
        return true;
    }

    // Test source is neither undefined nor null.
    if (!source) {
        return false;
    }

    // Detour an object that is wrapped by Proxy.
    return source.prototype === target.prototype;
}

export default class Type {
    /**
     * Encasulate as a type from source instance.
     *
     * @param {*} source
     * @returns {Type}
     **/
    constructor(source) {
        const key = !source ? fallback[`${source}`] : source;

        if (cache.has(key)) {
            throw new ReferenceError(`Type<${source && source.name}> is already constructed`);
        }

        this[typeCapsule] = source;

        // Makes an instance to unable to mutate and singletonizes an instance.
        Object.freeze(this);
        cache.set(key, this);
    }

    /**
     * Get type of instance.
     *
     * @param {*} instance
     * @returns {Type}
     **/
    static of(instance) {
        const source = instance === undefined || instance === null ? instance : instance.constructor;

        return Type.from(source);
    }

    /**
     * Find or create type instance from source instance.
     *
     * @param {*} source
     * @returns {Type}
     **/
    static from(source) {
        const key = !source ? fallback[`${source}`] : source;

        return cache.has(key) ? cache.get(key) : new Type(source);
    }

    /**
     * Test type equivalence by provided target.
     *
     * @example
     * Type.of(1).is(Boolean); // true
     * Type.of('Hello, world').is(String); // true
     * Type.of(true).is(Function); // false
     *
     * @param {*} target
     * @returns {boolean}
     **/
    is(target) {
        const [ test, plurality ] = [ target => compareByRelation(this[typeCapsule], target), Array.isArray(target) ];

        if (plurality ? target.every(checkIncapability) : checkIncapability(target)) {
            throw new TypeError(`${target} does not to be a Type`);
        }

        return plurality ? target.some(test) : test(target);
    }

    /**
     * Name of encapsulated type.
     *
     * @returns {string}
     **/
    get name() {
        const target = this[typeCapsule];

        return String(target && target.name);
    }

    /**
     * Define tag for `Object.prototype.toString`
     *
     * @returns {string}
     **/
    get [Symbol.toStringTag]() {
        return `Type<${this.name}>`;
    }
}
