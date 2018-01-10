import test from 'ava';
import '../sources/overloading';

test('should be able to overload functions', test => {
    const convert = Function.overload(overload => {
        overload(Number, number => String(number));
        overload(String, string => Number(string));
        overload(() => NaN);
    });

    test.is(convert('123'), 123);
    test.is(convert(123), '123');
    test.true(Number.isNaN(convert(undefined)));

    const add = Function.overload(overload => {
        overload(Number, String, (alfa, bravo) => alfa + Number(bravo));
        overload(String, Number, (alfa, bravo) => Number(alfa) + bravo);
    });

    test.is(add(123, '456'), 579);
    test.is(add('123', 456), 579);

    const getSum = Function.overload(overload => {
        overload(Number, number => number);
        overload(Number, Number, (alfa, bravo) => alfa + bravo);
        overload(Number, Number, Number, (alfa, bravo, charlie) => alfa + bravo + charlie);
        overload(() => NaN);
    });

    test.is(getSum(123), 123);
    test.is(getSum(123, 456), 579);
    test.is(getSum(123, 456, 789), 1368);
    test.true(Number.isNaN(getSum('')));

    const typelessAdd = Function.overload(overload => {
        overload([ Number, String ], [ Number, String ], (alfa, bravo) => Number(alfa) + Number(bravo));
    });

    test.is(typelessAdd(123, '456'), 579);
    test.is(typelessAdd('123', 456), 579);
});

test('should not be able to overload functions if invalid conditition provided', test => {
    const invalidOtherwiseConvert = Function.overload(overload => {
        overload(Number, number => String(number));
        test.throws(() => overload(123456789), TypeError);
    });

    test.throws(() => invalidOtherwiseConvert('123'), TypeError);

    const undefinedOtherwiseConvert = Function.overload(() => {});

    test.throws(() => undefinedOtherwiseConvert('456'), TypeError);
});
