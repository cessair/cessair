import '../sources/overloading';

test('should be able to overload functions', () => {
    const convert = Function.overload(overload => {
        overload(Number, number => String(number));
        overload(String, string => Number(string));
        overload(() => NaN);
    });

    expect(convert('123')).toBe(123);
    expect(convert(123)).toBe('123');
    expect(Number.isNaN(convert(undefined))).toBe(true);

    const add = Function.overload(overload => {
        overload(Number, String, (alfa, bravo) => alfa + Number(bravo));
        overload(String, Number, (alfa, bravo) => Number(alfa) + bravo);
    });

    expect(add(123, '456')).toBe(579);
    expect(add('123', 456)).toBe(579);

    const getSum = Function.overload(overload => {
        overload(Number, number => number);
        overload(Number, Number, (alfa, bravo) => alfa + bravo);
        overload(Number, Number, Number, (alfa, bravo, charlie) => alfa + bravo + charlie);
        overload(() => NaN);
    });

    expect(getSum(123)).toBe(123);
    expect(getSum(123, 456)).toBe(579);
    expect(getSum(123, 456, 789)).toBe(1368);
    expect(Number.isNaN(getSum(''))).toBe(true);

    const typelessAdd = Function.overload(overload => {
        overload([ Number, String ], [ Number, String ], (alfa, bravo) => Number(alfa) + Number(bravo));
    });

    expect(typelessAdd(123, '456')).toBe(579);
    expect(typelessAdd('123', 456)).toBe(579);
});

test('should not be able to overload functions if invalid conditition provided', () => {
    const invalidOtherwiseConvert = Function.overload(overload => {
        overload(Number, number => String(number));
        expect(() => overload(123456789)).toThrow(TypeError);
    });

    expect(() => invalidOtherwiseConvert('123')).toThrow(TypeError);

    const undefinedOtherwiseConvert = Function.overload(() => {});

    expect(() => undefinedOtherwiseConvert('456')).toThrow(TypeError);
});
