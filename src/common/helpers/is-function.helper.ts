/**
 * Validates if given object value is a function.
 *
 * @param fn Object to be analyzed.
 *
 * @returns True if value is a function, otherwise false.
 */
export const isFunction = (fn: any): boolean => typeof fn === 'function';
