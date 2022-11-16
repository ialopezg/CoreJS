/**
 * Validates if given object value is undefined.
 *
 * @param value Object to be analyzed.
 *
 * @returns True if value is undefined, otherwise false.
 */
export const isUndefined = (value: any): boolean => typeof value === 'undefined';
