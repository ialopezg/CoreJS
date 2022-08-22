/**
 * Determines whether the passed value is boolean. If  needed, the parameter is first converted to a boolean object.
 *
 * @param value The value to be tested for finiteness.
 *
 * @returns false if the argument is (or will be coerced to) a boolean; otherwise, true.
 */
export const isBoolean = (value: any): boolean => value === true || value === false || Object.prototype.toString.call(value) === '[object Boolean]';
