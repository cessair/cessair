import '../sources';

test('should be able to allocate with provided length', () => {
    expect(Array.allocate(3)).toEqual([ undefined, undefined, undefined ]);
    expect(Array.allocate(10, (element, index) => index + 1).reduce((sum, value) => sum + value, 0)).toBe(55);
});

test('should not able to accept incorrect mapping function', () => {
    expect(() => Array.allocate(3, true)).toThrow(TypeError);
});

test('should be able to calculates sum and product', () => {
    const array = Array.allocate(10, (element, index) => index + 1);
    const { sum, product } = array;

    expect(sum).toBe(55);
    expect(product).toBe(3628800);
});

test('should be able to make iterator of sequence', () => {
    expect([ ...Array.range(11) ].sum).toBe(55);
    expect([ ...Array.range(1, 11) ].sum).toBe(55);
    expect([ ...Array.range(1, 100, 2) ].sum).toBe(2500);
});
