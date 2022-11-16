/**
 * Determines whether the passed value is string type. If  needed, the parameter is first converted to a string object.
 *
 * @param value The value to be tested for finiteness.
 *
 * @returns false if the argument is (or will be coerced to) a string; otherwise, true.
 */
export const isString = (value: any): boolean => Object.prototype.toString.call(value) === '[object String]';
