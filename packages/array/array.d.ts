// Type definitions for @cessair/array 1.0.1
// Definitions by: Yongbin Min <https://www.cichol.com>
// Definitions: https://github.com/cessair/cessair
// TypeScript Version: 3.0

export {};

declare global {
    interface ArrayConstructor {
        /**
         * Make an array with mapping condition.
         *
         * @example
         * // Both are the same.
         * Array.allocate(10, (element, index) => index);
         * Array(10).fill().map((element, index) => index);
         **/
        allocate<T>(
            length: number,
            mapFunction?: (value: undefined, index: number, array?: ReadonlyArray<T[]>) => T,
            thisArgument?: any
        ): T[];

        allocate<X extends Function>(
            length: number,
            mapFunction?: X,
            thisArgument?: any
        ): X extends Function ? any[] : never;

        allocate<X>(
            length: number,
            mapFunction?: X,
            thisArgument?: any
        ): X extends (...args: any[]) => infer R ? R[] : never;

        /**
         * Make iterator of sequence by provided arguments.
         * Inspired by Python built-in function `range`.
         *
         * The default start value is 0 and incremented by 1.
         **/
        range(stop: number): IterableIterator<number>;

        /**
         * Make iterator of sequence by provided arguments.
         * Inspired by Python built-in function `range`.
         *
         * The default step value is 1 and able to set negative number.
         **/
        range(start: number, stop: number, step?: number): IterableIterator<number>;
    }

    interface Array<T> {
        /**
         * Calculate sum of the array.
         *
         * @returns {number}
         **/
        readonly sum: Extract<T, number>;

        /**
         * Calculate product of the array.
         *
         * @returns {number}
         **/
        readonly product: Extract<T, number>;
    }
}
