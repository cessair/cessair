// Type definitions for @cessair/generic 1.1.10
// Definitions by: Yongbin Min <https://www.cichol.com>
// Definitions: https://github.com/cessair/cessair
// TypeScript Version: 3.0

/**
 * Make specific decorator to generalize a class.
 *
 * @example
 * class Container { ... }
 *
 * const GenericContainer = generic`T : ${Number}`(Container);
 * const NumericContaienr = GenericContainer.$(Number);
 *
 * return new NumericContainer(...);
 *
 * @param source
 * @param references
 */
export function generic(source: string[], ...references: (new (...args: any[]) => any)[]): ClassDecorator;
