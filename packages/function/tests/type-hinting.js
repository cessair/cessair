import test from 'ava';
import '../sources/type-hinting';

test('should be able to hint type constraints', $ => {
    const toUpperCase = Function.typeHint(String, string => string.toUpperCase());
    const toDouble = Function.typeHint(Number, number => number * 2);

    $.is(toUpperCase('abc'), 'ABC');
    $.is(toDouble(123), 246);
    $.throws(() => toUpperCase(456), TypeError);
    $.throws(() => toDouble('def'), TypeError);

    const typelessToDouble = Function.typeHint([ Number, String ], number => Number(number) * 2);

    $.is(typelessToDouble(123), 246);
    $.is(typelessToDouble('123'), 246);
});
