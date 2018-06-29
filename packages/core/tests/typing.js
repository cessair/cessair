import Type from '../sources/typing';

function testDiversely(coreType, ...values) {
    const types = values.map(value => Type.of(value));

    expect(types.every(type => type.is(coreType))).toBe(true);
    expect(types.reduce((previous, current) => previous === current && current)).toBeTruthy();
}

const [ GeneratorFunction, AsyncFunction ] = [
    function* generatorFunction() {}, // eslint-disable-line no-empty-function
    async function asyncFunction() {} // eslint-disable-line no-empty-function
].map(({ constructor }) => constructor);

test('should be able to distinguish undefined and null', () => {
    const [ undefinedType, nullType ] = [ undefined, null ].map(Type.of);

    expect(undefinedType.is(undefined)).toBe(true);
    expect(undefinedType.is(null)).toBe(false);
    expect(nullType.is(null)).toBe(true);
    expect(nullType.is(undefined)).toBe(false);
});

test('should be ensure type instance that is singleton', () => {
    expect(() => new Type(undefined)).toThrow(ReferenceError);
});

test('should be able to assume that heir type is heritor type', () => {
    class Heritor {}

    class Heir extends Heritor {}

    expect(Type.of(new Heir()).is(Heritor)).toBe(true);
});

test('should be able to think instances of diverse object constructing expression are all the same', () => {
    testDiversely(
        Array,
        [],
        new Array() // eslint-disable-line no-array-constructor
    );

    testDiversely(
        Object,
        {},
        new Object() // eslint-disable-line no-new-object
    );

    testDiversely(
        Function,
        function testFunction() {}, // eslint-disable-line no-empty-function, prefer-arrow-callback
        () => {},
        class TestClass {},
        new Function() // eslint-disable-line no-new-func
    );

    testDiversely(
        GeneratorFunction,
        function* generatorFunction() {}, // eslint-disable-line no-empty-function, prefer-arrow-callback
        new GeneratorFunction()
    );

    testDiversely(
        AsyncFunction,
        async function asyncFunction() {}, // eslint-disable-line no-empty-function, prefer-arrow-callback
        async () => {},
        new AsyncFunction()
    );

    testDiversely(
        Boolean,
        true,
        false,
        new Boolean() // eslint-disable-line no-new-wrappers
    );

    testDiversely(
        Number,
        0,
        -0,
        Infinity,
        -Infinity,
        NaN,
        new Number() // eslint-disable-line no-new-wrappers
    );

    testDiversely(
        String,
        '',
        new String() // eslint-disable-line no-new-wrappers
    );

    testDiversely(RegExp, / /, new RegExp());
});

test('should be able to think instances of diverse function constructing expression are all the same', () => {
    expect([
        // Regular function.
        function testFunction() {},
        new Function(), // eslint-disable-line no-new-func

        // Array function.
        () => {},

        // Class declaration.
        class TestClass {},

        // Generator function.
        function* generatorFunction() {}, // eslint-disable-line no-empty-function
        new GeneratorFunction(),

        // Async function.
        async function asyncFunction() {}, // eslint-disable-line no-empty-function
        async () => {},
        new AsyncFunction()
    ].every(value => Type.of(value).is(Function))).toBe(true);
});
