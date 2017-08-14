import test from 'ava';
import '../libraries/enlargement';

const enlargement = {
    status: 'fine',

    add(a, b) {
        return a + b;
    },

    get value() {
        return 'test';
    },

    set value(value) {
        value.count += 1; // eslint-disable-line
    },

    * range() {
        yield* [ 1, 2, 3 ];
    },

    * [Symbol.iterator]() {
        yield* [ 4, 5, 6 ];
    }
};

const assertExtended = function assertExtended(test, extended) {
    test.false(extended.propertyIsEnumerable('status'));
    test.false(extended.propertyIsEnumerable('add'));
    test.false(extended.propertyIsEnumerable('value'));
    test.is(extended.status, 'fine');
    test.is(extended.add(12, 34), 46);
    test.is(extended.value, 'test');

    const object = { count: 12 };

    extended.value = object; // eslint-disable-line

    test.is(object.count, 13);
    test.deepEqual([ ...extended.range() ], [ 1, 2, 3 ]);
    test.deepEqual([ ...extended ], [ 4, 5, 6 ]);
};

test('should be ensure extending property as non-enumerable', test => {
    test.is(typeof Function.prototype.enhance, 'function');
    test.false(Function.prototype.propertyIsEnumerable('enhance'));
    test.is(typeof Object.prototype.enlarge, 'function');
    test.false(Object.prototype.propertyIsEnumerable('enlarge'));
});

test('should be able to enhance a function as non-enumerable', test => {
    class TestClass {

    }

    TestClass.enhance(enlargement);
    assertExtended(test, new TestClass());
});

test('should be able to enlarge an object as non-enumerable', test => {
    const testObject = {};

    testObject.enlarge(enlargement);
    assertExtended(test, testObject);
});

test('should be able to throw error if invalid descriptor provided as an arguments', test => {
    const testObject = {};

    test.throws(() => testObject.enlarge('string'), TypeError);
});
