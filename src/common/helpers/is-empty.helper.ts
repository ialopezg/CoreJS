import { isArray } from './is-array.helper';
import { isBoolean } from './is-boolean.helper';
import { isDate } from './is-date.helper';
import { isFunction } from './is-function.helper';
import { isNumber } from './is-number.helper';
import { isString } from './is-string.helper';
import { isUndefined } from './is-undefined.helper';

/**
 * Whether given object value is empty.
 *
 * @param value Object to be analyzed.
 *
 * @returns True if value is empty, otherwise false.
 */
export const isEmpty = (value: any): boolean => {
  // undefined or null
  if (isUndefined(value)) {
    return true;
  }

  // null value
  if (value == null) {
    return true;
  }

  // function, number, boolean, or date
  if (isFunction(value) || isNumber(value) || isBoolean(value) || isDate(value)) {
    return false;
  }

  // empty object
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  // string or array
  if (isString(value) || isArray(value)) {
    return !value.length;
  }

  return false;
};
