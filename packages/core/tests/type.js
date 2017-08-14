import test from 'ava';
import Type from '../libraries/type';

function testDiversely(test, coreType, ...values) {
    const types = values.map(value => Type.of(value));

    test.true(types.every(type => type.is(coreType)));
    test.truthy(types.reduce((previous, current) => previous === current && current));
}

const [ GeneratorFunction, AsyncFunction ] = [
    function* generatorFunction() {}, // eslint-disable-line
    async function asyncFunction() {} // eslint-disable-line
].map(({ constructor }) => constructor);

test('should be able to distinguish undefined and null', test => {
    const [ undefinedType, nullType ] = [ undefined, null ].map(Type.of);

    test.true(undefinedType.is(undefined));
    test.false(undefinedType.is(null));
    test.true(nullType.is(null));
    test.false(nullType.is(undefined));
});

test('should be ensure type instance that is singleton', test => {
    test.throws(() => new Type(undefined), ReferenceError);
});

test('should be able to assume that heir type is heritor type', test => {
    class Heritor {

    }

    class Heir extends Heritor {

    }

    test.true(Type.of(new Heir()).is(Heritor));
});

test('should be able to think instances of diverse object constructing expression are all the same', test => {
    const testVariously = (...args) => testDiversely(test, ...args);

    testVariously(
        Array,
        [],
        new Array() // eslint-disable-line
    );

    testVariously(
        Object,
        {},
        new Object() // eslint-disable-line
    );

    testVariously(
        Function,
        function testFunction() {}, // eslint-disable-line
        () => {},
        class TestClass {},
        new Function() // eslint-disable-line
    );

    testVariously(
        GeneratorFunction,
        function* generatorFunction() {}, // eslint-disable-line
        new GeneratorFunction()
    );

    testVariously(
        AsyncFunction,
        async function asyncFunction() {}, // eslint-disable-line
        async () => {},
        new AsyncFunction()
    );

    testVariously(
        Boolean,
        true,
        false,
        new Boolean() // eslint-disable-line
    );

    testVariously(
        Number,
        0,
        -0,
        Infinity,
        -Infinity,
        NaN,
        new Number() // eslint-disable-line
    );

    testVariously(
        String,
        '',
        new String() // eslint-disable-line
    );

    testVariously(
        RegExp,
        / /,
        new RegExp()
    );
});

test('should be able to think instances of diverse function constructing expression are all the same', test => {
    test.true([
        // Regular function.
        function testFunction() {},
        new Function(), // eslint-disable-line

        // Array function.
        () => {},

        // Class declaration.
        class TestClass {},

        // Generator function.
        function* generatorFunction() {}, // eslint-disable-line
        new GeneratorFunction(),

        // Async function.
        async function asyncFunction() {}, //eslint-disable-line
        async () => {},
        new AsyncFunction()
    ].every(value => Type.of(value).is(Function)));
});
