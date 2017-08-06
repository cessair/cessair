const cache = new WeakMap();
const fallback = { undefined() {}, null() {} };

function isAbleToBeType(target) {
    return target !== undefined && target !== null && typeof target !== 'function';
}

function analyzeInheritance(heir, heritor) {
    return heir === heritor || Boolean(heritor) && (
        heritor === Function ? heritor.isPrototypeOf(heir) : heir instanceof heritor
    );
}

export default class Type {
    constructor(delegate) {
        const key = !delegate ? fallback[`${delegate}`] : delegate;

        if(cache.has(key)) {
            throw new ReferenceError(`Type<${delegate && delegate.name}> is already constructed`);
        }

        Reflect.defineProperty(this, 'heir', { value: delegate, writable: false, enumerable: false });

        // Makes to immutable and caching.
        Object.freeze(this);
        cache.set(key, this);
    }

    static of(heir) {
        const delegate = heir === undefined || heir === null ? heir : heir.constructor;
        const key = !delegate ? fallback[`${delegate}`] : delegate;

        return cache.has(key) ? cache.get(key) : new Type(delegate);
    }

    is(heritor) {
        const [ inspect, plurality ] = [ heritor => analyzeInheritance(this.heir, heritor), Array.isArray(heritor) ];

        if(plurality ? heritor.every(isAbleToBeType) : isAbleToBeType(heritor)) {
            throw new TypeError(`${heritor} does not to be a Type`);
        }

        return plurality ? heritor.some(inspect) : inspect(heritor);
    }

    get [Symbol.toStringTag]() {
        return `Type<${this.heir && this.heir.name}>`;
    }
}
