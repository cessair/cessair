export {};

type Type = (Function | Function[])[];

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
        typeHint(type0: Type): Function;
        typeHint(type0: Type, type1: Type): Function;
        typeHint(type0: Type, type1: Type, type2: Type): Function;
        typeHint(type0: Type, type1: Type, type2: Type, type3: Type): Function;
        typeHint(type0: Type, type1: Type, type2: Type, type3: Type, type4: Type): Function;
        typeHint(type0: Type, type1: Type, type2: Type, type3: Type, type4: Type, type5: Type): Function;
        typeHint(type0: Type, type1: Type, type2: Type, type3: Type, type4: Type, type5: Type, type6: Type): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            type18: Type
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            type18: Type,
            type19: Type
        ): Function;

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
        overload(type0: Type, attachment: Function): Function;
        overload(type0: Type, type1: Type, attachment: Function): Function;
        overload(type0: Type, type1: Type, type2: Type, attachment: Function): Function;
        overload(type0: Type, type1: Type, type2: Type, type3: Type, attachment: Function): Function;
        overload(type0: Type, type1: Type, type2: Type, type3: Type, type4: Type, attachment: Function): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            type18: Type,
            attachment: Function
        ): Function;
        overload(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            type18: Type,
            type19: Type,
            attachment: Function
        ): Function;
    }

    interface FunctionConstructor {
        /**
         * Get unique identity of the target function.
         **/
        getOwnIdentity(target?: Function): symbol;

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
        typeHint(context: Function): Function;
        typeHint(type0: Type, context: Function): Function;
        typeHint(type0: Type, type1: Type, context: Function): Function;
        typeHint(type0: Type, type1: Type, type2: Type, context: Function): Function;
        typeHint(type0: Type, type1: Type, type2: Type, type3: Type, context: Function): Function;
        typeHint(type0: Type, type1: Type, type2: Type, type3: Type, type4: Type, context: Function): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            type18: Type,
            context: Function
        ): Function;
        typeHint(
            type0: Type,
            type1: Type,
            type2: Type,
            type3: Type,
            type4: Type,
            type5: Type,
            type6: Type,
            type7: Type,
            type8: Type,
            type9: Type,
            type10: Type,
            type11: Type,
            type12: Type,
            type13: Type,
            type14: Type,
            type15: Type,
            type16: Type,
            type17: Type,
            type18: Type,
            type19: Type,
            context: Function
        ): Function;

        /**
         * Make overloaded function by given type information.
         *
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
        overload(
            describer: (
                overload:
                    | ((type0: Type, target: Function) => void)
                    | ((type0: Type, type1: Type, target: Function) => void)
                    | ((type0: Type, type1: Type, type2: Type, target: Function) => void)
                    | ((type0: Type, type1: Type, type2: Type, type3: Type, target: Function) => void)
                    | ((type0: Type, type1: Type, type2: Type, type3: Type, type4: Type, target: Function) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          type14: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          type14: Type,
                          type15: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          type14: Type,
                          type15: Type,
                          type16: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          type14: Type,
                          type15: Type,
                          type16: Type,
                          type17: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          type14: Type,
                          type15: Type,
                          type16: Type,
                          type17: Type,
                          type18: Type,
                          target: Function
                      ) => void)
                    | ((
                          type0: Type,
                          type1: Type,
                          type2: Type,
                          type3: Type,
                          type4: Type,
                          type5: Type,
                          type6: Type,
                          type7: Type,
                          type8: Type,
                          type9: Type,
                          type10: Type,
                          type11: Type,
                          type12: Type,
                          type13: Type,
                          type14: Type,
                          type15: Type,
                          type16: Type,
                          type17: Type,
                          type18: Type,
                          type19: Type,
                          target: Function
                      ) => void)
            ) => void
        ): Function;
    }
}
