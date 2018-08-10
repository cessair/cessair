// Type definitions for @cessair/core 1.1.11
// Definitions by: Yongbin Min <https://www.cichol.com>
// Definitions: https://github.com/cessair/cessair
// TypeScript Version: 3.0

declare global {
    interface Object {
        /**
         * Expand the object by a given object.
         *
         * This method is not the same as `Object.assign`.
         * and it will copy and paste all property descriptor of a given object to the object.
         *
         * @param descriptors An object to use expanding the object.
         * @param overriding If this value is `false`, not paste already existing property. the default value is `true`.
         * @param enumerable If this value is `true` and executing iteration, a property of the object will be exposed. the default value is `false`.
         **/
        expands(descriptors: object, overriding?: boolean, enumerable?: boolean): this;
    }

    interface Function {
        /**
         * Extend the prototype of the function by a given object.
         *
         * This method is almost same as the partial definition of class.
         * and it will copy and paste all property descriptor of a given object to the prototype of the function.
         *
         * @param descriptors An object to use extending the prototype of the function.
         * @param overriding If this value is `false`, not paste already existing property. the default value is `true`.
         * @param enumerable If this value is `true` and executing iteration, a property of the object will be exposed. the default value is `false`.
         **/
        extends(descriptors: object, overriding?: boolean, enumerable?: boolean): this;
    }
}

type Constructor = new (...args: any[]) => any;
type IsInherited < Inheritor , Inheritee extends Constructor > = Inheritor extends InstanceType<Inheritee> ? true : false;
type IsInheritable < T , NonInheritable, Inheritable> = T extends void ? NonInheritable : Inheritable;

interface Type<T> {
    /**
     * Test type equivalence by given constructor.
     *
     * In the specification of TypeScript, `null` and `undefined` will be recognized the same.
     * but in the real world, they are not the same.
     * so you have to beware of using this function to check nullable.
     *
     * @example
     * // Exactly same as target constructor.
     * Type.of(1).is(Boolean); // true
     * Type.of('Hello, world').is(String); // true
     * Type.of(true).is(Function); // false
     *
     * // Same as one of constructor's array.
     * Type.of(null).is([ null, Function ]); // true
     * Type.of(undefined).is([ null, Function ]); // false
     *
     * // If you want to compare other `Type` instance, use native operator `===`.
     * Type.of(true) === Type.of(false); // true
     * Type.of(1) === Type.of('1'); // false
     **/
    is(target: void | void[]): IsInheritable<T, boolean, false>;

    is<Constructible extends Constructor>(
        target: Constructible
    ): IsInheritable<T, false, IsInherited<T, Constructible>>;

    is<Constructible extends Constructor>(
        target: Constructible[]
    ): IsInheritable<T, boolean, IsInherited<T, Constructible>>;

    is<NonConstructible>(target: NonConstructible): never;

    /**
     * Name of encapsulated type.
     *
     * @example
     * Type.of(1).name === 'Type<Number>'; // true
     **/
    readonly name: string;
}

interface TypeConstructor {
    /**
     * Encasulate as a type from source instance.
     **/
    new (source: void): Type<void>;
    new <Constructible extends Constructor>(source: Constructible): Type<InstanceType<Constructible>>;

    /**
     * Get type of instance.
     **/
    of<V extends void>(target: V): Type<void>;
    of<F extends Function>(target: F): Type<Function>;
    of<T>(target: T): Type<T>;

    /**
     * Find or create type instance from source instance.
     **/
    from(source: void): Type<void>;
    from<Constructible extends Constructor>(source: Constructible): Type<InstanceType<Constructible>>;
}

export const Type: TypeConstructor;
