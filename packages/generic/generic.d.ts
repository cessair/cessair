/**
 * Make specific decorator to generalize a class.
 *
 * ---
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
export function generic(source: string[], ...references: any[]): ClassDecorator;
