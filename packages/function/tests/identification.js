import test from 'ava';
import '../sources/identification';

test('should be able to identify a function', test => {
    for(const target of [ undefined, null, Object, Function ]) {
        test.is(Function.getOwnIdentity(target), Function.getOwnIdentity(target));
    }

    for(const target of [ Object, Function ]) {
        test.is(target.identity, target.identity);
    }
});

test('should be able to check the prototype chain of a function', test => {
    class Alfa {

    }

    class Bravo extends Alfa {

    }

    class Charlie extends Bravo {

    }

    const { prototypeChain } = Charlie;

    test.deepEqual(
        prototypeChain,
        [ Charlie, Bravo, Alfa, Function, Object ].map(constructor => constructor.prototype)
    );
});

test('should not be able to identify not a function', test => {
    for(const target of [ true, false, NaN, Infinity, 'alfa', 'bravo', /(?:)/ ]) {
        test.throws(() => Function.getOwnIdentity(target), TypeError);
    }
});
