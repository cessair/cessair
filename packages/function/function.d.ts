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
         * ---
         * @example
         * const numberOnly = (x => x).typeHint(Number);
         *
         * numberOnly('1'); // will throw TypeError
         * numberOnly(1); // 1
         *
         * @param types The type information.
         **/
        typeHint(...types?: (Function | Function[])[]): Function;

        /**
         * Overload already declared function.
         *
         * ---
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
        overload(...types?: (Function | Function[])[], attachment: Function): Function;
    }

    interface FunctionConstructor {
        /**
         * Get unique identity of the target function.
         **/
        getOwnIdentity(target?: Function): symbol;

        /**
         * Make type-hinted function by given type information.
         *
         * ---
         * @example
         * const numberOnly = Function.typeHint(Number, x => x);
         *
         * numberOnly('1'); // will throw TypeError
         * numberOnly(1); // 1
         *
         * @param types The type information.
         * @param context The target function.
         **/
        typeHint(...types?: (Function | Function[])[], context: Function): Function;

        /**
         * Make overloaded function by given type information.
         *
         * ---
         * @example
         * const numberOrString = Function.overload(overload => {
         *     overload(Number, x => x);
         *     overload(String, x => x)
         * });
         *
         * numberOrString(true); // will throw TypeError
         * numberOrString(1); // 1
         * numberOrString('1'); // '1';
         *
         * @param describer The callback to describe function overloading.
         **/
        overload(describer: (overload: (...types: ...(Function | Function[]), target: Function) => void) => void): Function;
    }
}
