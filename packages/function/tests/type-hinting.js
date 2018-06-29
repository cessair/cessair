import '../sources/type-hinting';

test('should be able to hint type constraints', () => {
    const toUpperCase = Function.typeHint(String, string => string.toUpperCase());
    const toDouble = Function.typeHint(Number, number => number * 2);

    expect(toUpperCase('abc')).toBe('ABC');
    expect(toDouble(123)).toBe(246);
    expect(() => toUpperCase(456)).toThrow(TypeError);
    expect(() => toDouble('def')).toThrow(TypeError);

    const typelessToDouble = Function.typeHint([ Number, String ], number => Number(number) * 2);

    expect(typelessToDouble(123)).toBe(246);
    expect(typelessToDouble('123')).toBe(246);
});
