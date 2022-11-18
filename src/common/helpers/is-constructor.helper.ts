import { isUndefined } from './is-undefined.helper';

/**
 * Validates if given object value is a constructor function.
 *
 * @param fn Object to be analyzed.
 *
 * @returns True if value is a constructor function, otherwise false.
 */
export const isConstructor = (fn: any): boolean => {
  if (isUndefined(fn)) {
    return false;
  }

  try {
    // eslint-disable-next-line no-new
    new new Proxy(fn, { construct() { return {}; } })();

    return true;
  } catch (error: any) {
    try {
      return fn === 'constructor';
    } catch (e: any) {
      return false;
    }
  }
};
