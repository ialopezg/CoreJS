/**
 * Determines whether the passed value is an array. If  needed, the parameter is first converted to an array object.
 *
 * @param value The value to be tested for finiteness.
 */
export const isArray = (value: any) => Object.prototype.toString.call(value) === '[object Array]';
