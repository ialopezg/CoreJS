/**
 * Determines whether the passed value is a date object. If  needed, the parameter is first converted to a date object.
 *
 * @param value The value to be tested for finiteness.
 *
 * @returns false if the argument is (or will be coerced to) a date; otherwise, true.
 */
export const isDate = (value: any): boolean => Object.prototype.toString.call(value) === '[object Date]';
