import { Type } from '@cessair/core';
import generic from '../sources';

test('should be able to instantiate generic class with various type arguments', test => {
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

        test.notThrows(() => {
            instance.value = notThrows;
        });

        test.throws(() => {
            instance.value = throws;
        }, TypeError);
    }

    const instance = new (ContainerT.$(String))('Hello, world!');

    test.true(Type.of(instance).is(ContainerT));

    assertThrows(Boolean, true, false, 'Hello, world!');
    assertThrows(Number, 123, 456, 'Hello, world!');
    assertThrows(String, 'Hello, world!', 'Bravo!', 456);
    assertThrows(undefined, undefined, undefined, null);
    assertThrows(null, null, null, undefined);

    const NumberContainer = ContainerT.$(Number);
    const StringContainer = ContainerT.$(String);

    assertThrows(
        NumberContainer, new NumberContainer(123), new NumberContainer(456), new StringContainer('Hello, world!')
    );

    assertThrows(
        ContainerT, new NumberContainer(123), new StringContainer('Hello, world!'), true
    );
});

test('should be able to restrict type parameters by constraint keywords', test => {
    @generic`primitive T`
    class ContainerPrimitiveT {}

    @generic`complex T`
    class ContainerComplexT {}

    function assertThrows(T, notThrows, throws) {
        test.notThrows(() => (
            new (notThrows.$(T))()
        ));

        test.throws(() => (
            new (throws.$(T))()
        ), TypeError);
    }

    for(const item of [ undefined, null, Boolean, Symbol, Number, String ]) {
        assertThrows(item, ContainerPrimitiveT, ContainerComplexT);
    }

    assertThrows(Object, ContainerComplexT, ContainerPrimitiveT);
    assertThrows(Function, ContainerComplexT, ContainerPrimitiveT);
});

test('should be able to restrict type parameters by extending options', test => {
    @generic`K, V extends K | ${String}`
    class ContainerKV {}

    test.notThrows(() => (
        new (ContainerKV.$(Number, String))()
    ));

    test.notThrows(() => (
        new (ContainerKV.$(Number, Number))()
    ));

    test.throws(() => (
        new (ContainerKV.$(Number, Boolean))()
    ), TypeError);
});

test('should be able to set default argument to type parameters', test => {
    @generic`K = ${String}, V = K`
    class ContainerKV {
        constructor($) {
            this.$ = $;
        }
    }

    let instance = new (ContainerKV.$())();

    test.is(instance.$.K, String);
    test.is(instance.$.V, String);

    instance = new (ContainerKV.$(Number))();

    test.is(instance.$.K, Number);
    test.is(instance.$.V, Number);

    instance = new (ContainerKV.$(Symbol, Boolean))();

    test.is(instance.$.K, Symbol);
    test.is(instance.$.V, Boolean);

    @generic`A = ${String}, B = A, C`
    class ContainerABC {}

    test.throws(() => (
        new (ContainerABC.$())()
    ), TypeError);
});

test('should be able to work fine with very complex syntax', test => {
    @generic`primitive A, B : A | ${Boolean}, complex C = ${Object}, D : A | B | C, E extends D`
    class ContainerABCDE {}

    test.notThrows(() => (
        new (ContainerABCDE.$(String, Boolean, Object, Boolean, Boolean))()
    ));
});

test('should be able to use type parameters at methods', test => {
    @generic`T = ${String}`
    class ContainerT {
        toUpperCase(name, $) {
            $([ name, $.T ]);

            return name.toUpperCase();
        }
    }

    const container = new (ContainerT.$())();

    test.is(container.toUpperCase('cessair'), 'CESSAIR');
});
