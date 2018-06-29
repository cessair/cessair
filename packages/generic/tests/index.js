import { Type } from '@cessair/core';
import generic from '../sources';

test('should be able to instantiate generic class with various type arguments', () => {
    @generic`T`
    class ContainerT {
        constructor(value, $) {
            $([ value, $.T ]);

            let privateValue = value;

            this.expands({
                get value() {
                    return privateValue;
                },

                set value(value) {
                    $([ value, $.T ]);

                    privateValue = value;
                }
            });
        }
    }

    function assertThrows(T, initialArgument, notThrows, throws) {
        const instance = new (ContainerT.$(T))(initialArgument);

        expect(() => {
            instance.value = notThrows;
        }).not.toThrow();

        expect(() => {
            instance.value = throws;
        }).toThrow(TypeError);
    }

    const instance = new (ContainerT.$(String))('Hello, world!');

    expect(Type.of(instance).is(ContainerT)).toBe(true);

    assertThrows(Boolean, true, false, 'Hello, world!');
    assertThrows(Number, 123, 456, 'Hello, world!');
    assertThrows(String, 'Hello, world!', 'Bravo!', 456);
    assertThrows(undefined, undefined, undefined, null);
    assertThrows(null, null, null, undefined);

    const NumberContainer = ContainerT.$(Number);
    const StringContainer = ContainerT.$(String);

    assertThrows(
        NumberContainer,
        new NumberContainer(123),
        new NumberContainer(456),
        new StringContainer('Hello, world!')
    );

    assertThrows(ContainerT, new NumberContainer(123), new StringContainer('Hello, world!'), true);
});

test('should be able to restrict type parameters by constraint keywords', () => {
    @generic`primitive T`
    class ContainerPrimitiveT {}

    @generic`complex T`
    class ContainerComplexT {}

    function assertThrows(T, notThrows, throws) {
        expect(() => new (notThrows.$(T))()).not.toThrow();
        expect(() => new (throws.$(T))()).toThrow(TypeError);
    }

    for (const item of [ undefined, null, Boolean, Symbol, Number, String ]) {
        assertThrows(item, ContainerPrimitiveT, ContainerComplexT);
    }

    assertThrows(Object, ContainerComplexT, ContainerPrimitiveT);
    assertThrows(Function, ContainerComplexT, ContainerPrimitiveT);
});

test('should be able to restrict type parameters by extending options', () => {
    @generic`K, V extends K | ${String}`
    class ContainerKV {}

    expect(() => new (ContainerKV.$(Number, String))()).not.toThrow();
    expect(() => new (ContainerKV.$(Number, Number))()).not.toThrow();
    expect(() => new (ContainerKV.$(Number, Boolean))()).toThrow(TypeError);
});

test('should be able to set default argument to type parameters', () => {
    @generic`K = ${String}, V = K`
    class ContainerKV {
        constructor($) {
            this.$ = $;
        }
    }

    let instance = new (ContainerKV.$())();

    expect(instance.$.K).toBe(String);
    expect(instance.$.V).toBe(String);

    instance = new (ContainerKV.$(Number))();

    expect(instance.$.K).toBe(Number);
    expect(instance.$.V).toBe(Number);

    instance = new (ContainerKV.$(Symbol, Boolean))();

    expect(instance.$.K).toBe(Symbol);
    expect(instance.$.V).toBe(Boolean);

    @generic`A = ${String}, B = A, C`
    class ContainerABC {}

    expect(() => new (ContainerABC.$())()).toThrow(TypeError);
});

test('should be able to work fine with very complex syntax', () => {
    @generic`primitive A, B : A | ${Boolean}, complex C = ${Object}, D : A | B | C, E extends D`
    class ContainerABCDE {}

    expect(() => new (ContainerABCDE.$(String, Boolean, Object, Boolean, Boolean))()).not.toThrow();
});

test('should be able to use type parameters at methods', () => {
    @generic`T = ${String}`
    class ContainerT {
        toUpperCase(name, $) {
            $([ name, $.T ]);

            return name.toUpperCase();
        }
    }

    const container = new (ContainerT.$())();

    expect(container.toUpperCase('cessair')).toBe('CESSAIR');
});
