import { Type } from '@cessair/core';

const [ undefinedIdentity, nullIdentity ] = [ undefined, null ].map(Symbol);
const identitiesMap = new WeakMap();

Function.expands({
    /**
     * Get unique identity of the target function.
     *
     * @param {Function?} target
     * @returns {symbol}
     **/
    getOwnIdentity(target) {
        if(target === undefined) {
            return undefinedIdentity;
        }

        if(target === null) {
            return nullIdentity;
        }

        if(!Type.of(target).is(Function)) {
            throw new TypeError(`Type of ${target} is not undefined or null or function`);
        }

        return target.identity;
    }
});

Function.extends({
    /**
     * Get unique identity of the function.
     *
     * @returns {symbol}
     **/
    get identity() {
        if(identitiesMap.has(this)) {
            return identitiesMap.get(this);
        }

        const identity = Symbol(this.name);

        identitiesMap.set(this, identity);

        return identity;
    },

    /**
     * Get the prototype chain of the function.
     *
     * @returns {Function[]}
     **/
    get prototypeChain() {
        const chain = [];

        for(let prototype = this; prototype !== null; prototype = Reflect.getPrototypeOf(prototype)) {
            chain.push(prototype);
        }

        return chain.map(constructor => constructor.prototype || constructor);
    },

    /**
     * Get the inheritance chain of the function.
     *
     * @returns {Function[]}
     **/
    get inheritanceChain() {
        return this.prototypeChain.map(prototype => prototype.constructor || prototype);
    }
});
