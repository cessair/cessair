declare global {
    interface Object {
        /**
         * Expand the object by a given object.
         * This method is not the same as `Object.assign`.
         * This method will copy and paste all property descriptor of a given object to the object.
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
         * This method is almost same as the partial definition of class.
         * This method will copy and paste all property descriptor of a given object to the prototype of the function.
         *
         * @param descriptors An object to use extending the prototype of the function.
         * @param overriding If this value is `false`, not paste already existing property. the default value is `true`.
         * @param enumerable If this value is `true` and executing iteration, a property of the object will be exposed. the default value is `false`.
         **/
        extends(descriptors: object, overriding?: boolean, enumerable?: boolean): this;
    }
}

interface Constructor {
    readonly prototype: any;
}

/**
 * @example
 * // Capable.
 * undefined, null, Function;
 *
 * // Incapable.
 * true, 1, 'a', Symbol(), {};
 **/
type Capable = undefined | null | Constructor;

export class Type {
    /**
     * Encasulate as a type from source instance.
     **/
    constructor(source: Capable);

    /**
     * Get type of instance.
     **/
    static of(target: any): Type;

    /**
     * Find or create type instance from source instance.
     **/
    static from(source: Capable): Type;

    /**
     * Test type equivalence by provided target.
     *
     * ---
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
    is(target: Capable | Capable[]): boolean;

    /**
     * Name of encapsulated type.

     * ---
     * @example
     * Type.of(1).name === 'Type<Number>'; // true
     **/
    name: string;

    /**
     * Define tag for inherited property `Object.prototype.toString`.
     *
     * ---
     * @example
     * Type.of(1).toString() === '[object Type<Number>]'; // true
     **/
    [Symbol.toStringTag]: string;
}
