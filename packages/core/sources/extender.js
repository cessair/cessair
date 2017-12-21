const makeExtendingOrExpandingBroker = keyword => function broker(descriptors, overriding = true, enumerable = false) {
    const boundary = keyword === 'extends' ? this.prototype : this;

    if(!(descriptors instanceof Object)) {
        throw new TypeError(`${descriptors} is not an object`);
    }

    if(descriptors instanceof Function) {
        if(!descriptors.name) {
            throw new ReferenceError(`Descriptor ${descriptors} does not have a name`);
        }

        return Reflect.apply(this[keyword], this, [ { descriptors } ]);
    }

    const keys = do {
        const keys = Reflect.ownKeys(descriptors);

        if(overriding) {
            keys; // eslint-disable-line no-unused-expressions
        } else {
            keys.filter(key => !(key in boundary));
        }
    };

    for(const key of keys) {
        const descriptor = Reflect.getOwnPropertyDescriptor(descriptors, key);

        Reflect.defineProperty(boundary, key, { ...descriptor, enumerable });
    }

    return this;
};

for(const [ target, property ] of [ [ Object, 'expands' ], [ Function, 'extends' ] ]) {
    const expander = makeExtendingOrExpandingBroker(property);

    Reflect.defineProperty(expander, 'name', { ...Reflect.getOwnPropertyDescriptor(expander, 'name'), name: property });
    Reflect.defineProperty(target.prototype, property, { value: expander, writable: true, configurable: true });
}
