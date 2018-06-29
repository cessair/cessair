import '../sources/extender';

const expansion = {
    status: 'fine',

    add(a, b) {
        return a + b;
    },

    get value() {
        return 'test';
    },

    set value(value) {
        value.count += 1; // eslint-disable-line no-param-reassign
    },

    * range() {
        yield* [ 1, 2, 3 ];
    },

    * [Symbol.iterator]() {
        yield* [ 4, 5, 6 ];
    }
};

const assertExtended = function assertExtended(extended) {
    expect(extended.propertyIsEnumerable('status')).toBe(false);
    expect(extended.propertyIsEnumerable('add')).toBe(false);
    expect(extended.propertyIsEnumerable('value')).toBe(false);
    expect(extended.status).toBe('fine');
    expect(extended.add(12, 34)).toBe(46);
    expect(extended.value).toBe('test');

    const object = { count: 12 };

    extended.value = object; // eslint-disable-line no-param-reassign

    expect(object.count).toBe(13);
    expect([ ...extended.range() ]).toEqual([ 1, 2, 3 ]);
    expect([ ...extended ]).toEqual([ 4, 5, 6 ]);
};

test('should be ensure extending property as non-enumerable', () => {
    expect(typeof Function.prototype.extends).toBe('function');
    expect(Function.prototype.propertyIsEnumerable('extends')).toBe(false);
    expect(typeof Object.prototype.expands).toBe('function');
    expect(Object.prototype.propertyIsEnumerable('expands')).toBe(false);
});

test('should be able to extends a function as non-enumerable', () => {
    class TestClass {}

    TestClass.extends(expansion);
    assertExtended(new TestClass());
});

test('should be able to expands an object as non-enumerable', () => {
    const testObject = {};

    testObject.expands(expansion);
    assertExtended(testObject);
});

test('should be able to throw error if invalid descriptor provided as an arguments', () => {
    const testObject = {};

    expect(() => testObject.expands('string')).toThrow(TypeError);
});
