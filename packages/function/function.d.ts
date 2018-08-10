// Type definitions for @cessair/function 1.0.6
// Definitions by: Yongbin Min <https://www.cichol.com>
// Definitions: https://github.com/cessair/cessair
// TypeScript Version: 3.0

export {};

type Constructor = new (...args: any[]) => any;

declare global {
    interface Function {
        /**
         * Get unique identity of the function.
         **/
        readonly identity: symbol;

        /**
         * Get the prototype chain of the function.
         **/
        readonly prototypeChain: Function[];

        /**
         * Get the inheritance chain of the function.
         **/
        readonly inheritanceChain: Function[];

        /**
         * Attach type information to already declared function.
         *
         * @example
         * const numberOnly = (x => x).typeHint(Number);
         *
         * numberOnly('1'); // will throw TypeError
         * numberOnly(1); // 1
         *
         * @param types The type information.
         **/
        typeHint<T0 extends Constructor>(type0: T0): (arg0: InstanceType<T0>) => any;
        typeHint<T0 extends Constructor, T1 extends Constructor>(
            type0: T0,
            type1: T1
        ): (arg0: InstanceType<T0>, arg1: InstanceType<T1>) => any;
        typeHint<T0 extends Constructor, T1 extends Constructor, T2 extends Constructor>(
            type0: T0,
            type1: T1,
            type2: T2
        ): (arg0: InstanceType<T0>, arg1: InstanceType<T1>, arg2: InstanceType<T2>) => any;
        typeHint<T0 extends Constructor, T1 extends Constructor, T2 extends Constructor, T3 extends Constructor>(
            type0: T0,
            type1: T1,
            type2: T2,
            type3: T3
        ): (arg0: InstanceType<T0>, arg1: InstanceType<T1>, arg2: InstanceType<T2>, arg3: InstanceType<T3>) => any;
        typeHint<
            T0 extends Constructor,
            T1 extends Constructor,
            T2 extends Constructor,
            T3 extends Constructor,
            T4 extends Constructor
        >(
            type0: T0,
            type1: T1,
            type2: T2,
            type3: T3,
            type4: T4
        ): (
            arg0: InstanceType<T0>,
            arg1: InstanceType<T1>,
            arg2: InstanceType<T2>,
            arg3: InstanceType<T3>,
            arg4: InstanceType<T4>
        ) => any;

        /**
         * Overload already declared function.
         *
         * @example
         * const numberOrString = (x => x).typeHint(Number).overload(String, x => x);
         *
         * numberOrString(true); // will throw TypeError
         * numberOrString(1); // 1
         * numberOrString('1'); // '1';
         *
         * @param types The type information.
         * @param attachment The attachment function to overload.
         **/
        overload(attachment: Function): Function;
        overload(type0: Constructor, attachment: Function): Function;
        overload(type0: Constructor, type1: Constructor, attachment: Function): Function;
        overload(type0: Constructor, type1: Constructor, type2: Constructor, attachment: Function): Function;
        overload(
            type0: Constructor,
            type1: Constructor,
            type2: Constructor,
            type3: Constructor,
            attachment: Function
        ): Function;
        overload(
            type0: Constructor,
            type1: Constructor,
            type2: Constructor,
            type3: Constructor,
            type4: Constructor,
            attachment: Function
        ): Function;
    }

    interface FunctionConstructor {
        /**
         * Get unique identity of the target function.
         **/
        getOwnIdentity<T extends Function | void>(target: T): symbol;
        getOwnIdentity<T>(target: Exclude<T, Function | void>): never;

        /**
         * Make type-hinted function by given type information.
         *
         * @example
         * const numberOnly = Function.typeHint(Number, x => x);
         *
         * numberOnly('1'); // will throw TypeError
         * numberOnly(1); // 1
         *
         * @param types The type information.
         * @param context The target function.
         **/
        typeHint<F extends (...args: any[]) => any>(context: F): F;

        typeHint<T0 extends Constructor, F extends (arg0: any) => any>(
            type0: T0,
            context: F
        ): (arg0: InstanceType<T0>) => ReturnType<F>;

        typeHint<T0 extends Constructor, T1 extends Constructor, F extends (arg0: any, arg1: any) => any>(
            type0: T0,
            type1: T1,
            context: F
        ): (arg0: InstanceType<T0>, arg1: InstanceType<T1>) => ReturnType<F>;

        typeHint<
            T0 extends Constructor,
            T1 extends Constructor,
            T2 extends Constructor,
            F extends (arg0: any, arg1: any, arg2: any) => any
        >(
            type0: T0,
            type1: T1,
            type2: T2,
            context: F
        ): (arg0: InstanceType<T0>, arg1: InstanceType<T1>, arg2: InstanceType<T2>) => ReturnType<F>;

        typeHint<
            T0 extends Constructor,
            T1 extends Constructor,
            T2 extends Constructor,
            T3 extends Constructor,
            F extends (arg0: any, arg1: any, arg2: any, arg3: any) => any
        >(
            type0: T0,
            type1: T1,
            type2: T2,
            type3: T2,
            context: F
        ): (
            arg0: InstanceType<T0>,
            arg1: InstanceType<T1>,
            arg2: InstanceType<T2>,
            arg3: InstanceType<T3>
        ) => ReturnType<F>;

        typeHint<
            T0 extends Constructor,
            T1 extends Constructor,
            T2 extends Constructor,
            T3 extends Constructor,
            T4 extends Constructor,
            F extends (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => any
        >(
            type0: T0,
            type1: T1,
            type2: T2,
            type3: T2,
            type4: T3,
            context: F
        ): (
            arg0: InstanceType<T0>,
            arg1: InstanceType<T1>,
            arg2: InstanceType<T2>,
            arg3: InstanceType<T3>,
            arg4: InstanceType<T4>
        ) => ReturnType<F>;

        /**
         * Make overloaded function by given type information.
         *
         * @example
         * const numberOrString = Function.overload(overload => {
         * 		overload(Number, x => x);
         * 		overload(String, x => x)
         * });
         *
         * numberOrString(true); // will throw TypeError
         * numberOrString(1); // 1
         * numberOrString('1'); // '1';
         *
         * @param describer The callback to describe function overloading.
         **/
        overload(
            describer: (
                overload:
                | ((type0: Constructor, target: Function) => void)
                | ((type0: Constructor, type1: Constructor, target: Function) => void)
                | ((type0: Constructor, type1: Constructor, type2: Constructor, target: Function) => void)
                | ((
                    type0: Constructor,
                    type1: Constructor,
                    type2: Constructor,
                    type3: Constructor,
                    target: Function
                ) => void)
                | ((
                    type0: Constructor,
                    type1: Constructor,
                    type2: Constructor,
                    type3: Constructor,
                    type4: Constructor,
                    target: Function
                ) => void)
            ) => void
        ): Function;
    }
}
