const getExtender = type => function extend(descriptors, overriding = true, enumerable = false) {
    const boundary = type === 'enlarge' ? this : this.prototype;

    if(!(descriptors instanceof Object)) {
        throw new TypeError(`${descriptors} is not an object`);
    }

    if(descriptors instanceof Function) {
        if(!descriptors.name) {
            throw new ReferenceError(`Descriptor ${descriptors} does not have a name`);
        }

        return Reflect.apply(this[type], this, [ { descriptors } ]);
    }

    const keys = do {
        const keys = Reflect.ownKeys(descriptors);

        if(overriding) {
            keys; // eslint-disable-line
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

for(const [ target, type ] of [ [ Object, 'enlarge' ], [ Function, 'enhance' ] ]) {
    const enlarger = getExtender(type);

    Reflect.defineProperty(enlarger, 'name', { ...Reflect.getOwnPropertyDescriptor(enlarger, 'name'), name: type });
    Reflect.defineProperty(target.prototype, type, { value: enlarger, writable: true, configurable: true });
}
