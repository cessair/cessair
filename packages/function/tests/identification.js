import '../sources/identification';

test('should be able to identify a function', () => {
    for (const target of [ undefined, null, Object, Function ]) {
        expect(Function.getOwnIdentity(target)).toEqual(Function.getOwnIdentity(target));
    }

    for (const target of [ Object, Function ]) {
        expect(target.identity).toEqual(target.identity);
    }
});

test('should be able to check the prototype chain of a function', () => {
    class Alfa {}

    class Bravo extends Alfa {}

    class Charlie extends Bravo {}

    const { prototypeChain } = Charlie;

    expect(prototypeChain).toEqual([ Charlie, Bravo, Alfa, Function, Object ].map(constructor => constructor.prototype)); // eslint-disable-line max-len
});

test('should not be able to identify not a function', () => {
    for (const target of [ true, false, NaN, Infinity, 'alfa', 'bravo', /(?:)/ ]) {
        expect(() => Function.getOwnIdentity(target)).toThrow(TypeError);
    }
});
