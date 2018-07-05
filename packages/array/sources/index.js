import '@cessair/core';
import '@cessair/common';

Array.expands({
    /**
     * Make an array with mapping condition.
     *
     * @param {number} length
     * @param {(value: undefined, index: number, array: any[]) => any[]} [mapFunction]
     * @param {any} [thisArgument]
     * @returns {any[]}
     **/
    allocate(length, mapFunction = element => element, thisArgument) {
        if (arguments.length > 1 && !(mapFunction instanceof Function)) {
            throw new TypeError(`${mapFunction} is not a function`);
        }

        return Array(length)
            .fill()
            .map(mapFunction, thisArgument);
    },

    /**
     * Make iterator of sequence by provided arguments.
     * Inspired by Python built-in function `range`.
     *
     * @param {number} start
     * @param {number} stop
     * @param {number} [step]
     * @returns {IterableIterator<number>}
     **/
    * range(...args) {
        const [ start, stop, step ] = args.length === 1 ? [ 0, args[0], 1 ] : args.length === 2 ? [ ...args, 1 ] : args; // eslint-disable-line no-nested-ternary
        const size = Math.ceil((stop - start) / step);

        for (let index = 0; index < size; index += 1) {
            yield start + index * step;
        }
    }
});

Array.extends({
    /**
     * Calculate sum of the array.
     *
     * @returns {number}
     **/
    get sum() {
        return this.reduce((current, next) => current + next, 0);
    },

    /**
     * Calculate product of the array.
     *
     * @returns {number}
     **/
    get product() {
        return this.reduce((current, next) => current * next, 1);
    }
});
