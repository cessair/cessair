const cache = new WeakMap();
const fallback = { undefined() {}, null() {} };

function assertHeritor(target) {
    return target !== undefined && target !== null && typeof target !== 'function';
}

function testRelation(heir, heritor) {
    // Test direct ancestor or undefined or null.
    if(heir === heritor) {
        return true;
    }

    // Test heritor is neither undefined nor null.
    if(!heritor) {
        return false;
    }

    // If this statement is true, heritor is Object.
    // Because, every instance of JavaScript is an object.
    if(heritor !== Function && heir instanceof heritor) {
        return true;
    }

    // Test inheritance hierarchy from prototype chain.
    if(heritor.isPrototypeOf(heir)) {
        return true;
    }

    // Test heir is neither undefined nor null.
    if(!heir) {
        return false;
    }

    // Detour an object that is wrapped by Proxy.
    return heir.prototype === heritor.prototype;
}

export default class Type {
    constructor(delegate) {
        const key = !delegate ? fallback[`${delegate}`] : delegate;

        if(cache.has(key)) {
            throw new ReferenceError(`Type<${delegate && delegate.name}> is already constructed`);
        }

        this.heir = delegate;

        // Makes an instance to unable to mutate and singletonizes an instance.
        Object.freeze(this);
        cache.set(key, this);
    }

    static of(heir) {
        const delegate = heir === undefined || heir === null ? heir : heir.constructor;

        return Type.from(delegate);
    }

    static from(delegate) {
        const key = !delegate ? fallback[`${delegate}`] : delegate;

        return cache.has(key) ? cache.get(key) : new Type(delegate);
    }

    is(heritor) {
        const [ test, plurality ] = [ heritor => testRelation(this.heir, heritor), Array.isArray(heritor) ];

        if(plurality ? heritor.every(assertHeritor) : assertHeritor(heritor)) {
            throw new TypeError(`${heritor} does not to be a Type`);
        }

        return plurality ? heritor.some(test) : test(heritor);
    }

    get [Symbol.toStringTag]() {
        return `Type<${this.heir && this.heir.name}>`;
    }
}
