const cache = new WeakMap();
const fallback = { undefined() {}, null() {} };

function testCapability(target) {
    return target !== undefined && target !== null && typeof target !== 'function';
}

function testRelation(source, target) {
    // Test direct ancestor or undefined or null.
    if(source === target) {
        return true;
    }

    // Test target is neither undefined nor null.
    if(!target) {
        return false;
    }

    // If this statement is true, target is Object.
    // Because, every instance of JavaScript is an object.
    if(target !== Function && source instanceof target) {
        return true;
    }

    // Test inheritance hierarchy from prototype chain.
    if(target.isPrototypeOf(source)) {
        return true;
    }

    // Test source is neither undefined nor null.
    if(!source) {
        return false;
    }

    // Detour an object that is wrapped by Proxy.
    return source.prototype === target.prototype;
}

export default class Type {
    constructor(source) {
        const key = !source ? fallback[`${source}`] : source;

        if(cache.has(key)) {
            throw new ReferenceError(`Type<${source && source.name}> is already constructed`);
        }

        this.representing = source;

        // Makes an instance to unable to mutate and singletonizes an instance.
        Object.freeze(this);
        cache.set(key, this);
    }

    static of(instance) {
        const source = instance === undefined || instance === null ? instance : instance.constructor;

        return Type.from(source);
    }

    static from(source) {
        const key = !source ? fallback[`${source}`] : source;

        return cache.has(key) ? cache.get(key) : new Type(source);
    }

    is(target) {
        const [ test, plurality ] = [ target => testRelation(this.representing, target), Array.isArray(target) ];

        if(plurality ? target.every(testCapability) : testCapability(target)) {
            throw new TypeError(`${target} does not to be a Type`);
        }

        return plurality ? target.some(test) : test(target);
    }

    get [Symbol.toStringTag]() {
        const { representing } = this;

        return `Type<${representing && representing.name}>`;
    }
}
