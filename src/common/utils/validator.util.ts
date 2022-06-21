/**
 * Whether given object value is empty.
 *
 * @param obj Object to be analyzed.
 *
 * @returns True if value is empty, otherwise false.
 */
export const isEmpty = (obj: any): boolean => {
  if (typeof obj === 'string') {
    return !((<string>obj).trim().length);
  }
  if (obj instanceof Object) {
    return !Object.keys(obj).length;
  }

  return !obj.length;
};

/**
 * Validates if given object value is undefined.
 *
 * @param obj Object to be analyzed.
 *
 * @returns True if value is undefined, otherwise false.
 */
export const isUndefined = (obj: any): boolean => typeof obj === 'undefined';

/**
 * Validates if given object value is a function.
 *
 * @param fn Object to be analyzed.
 *
 * @returns True if value is a function, otherwise false.
 */
export const isFunction = (fn: any): boolean => typeof fn === 'function';

/**
 * Validates if given object value is a constructor function.
 *
 * @param fn Object to be analyzed.
 *
 * @returns True if value is a constructor function, otherwise false.
 */
export const isConstructor = (fn: any): boolean => fn === 'constructor';

/**
 * Validates and normalized given path value is valid.
 *
 * @param path Object to be analyzed.
 *
 * @returns The path value normalized.
 */
export const validatePath = (path: string): string => (path.charAt(0) !== '/') ? '/' + path : path;
