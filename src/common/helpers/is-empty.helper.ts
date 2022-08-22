import { isFunction, isUndefined } from '../utils';
import { isNumber } from './is-number.helper';
import { isDate } from './is-date.helper';
import { isBoolean } from './is-boolean.helper';

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

  if (isFunction(value) || isNumber(value) || isBoolean(value) || isDate(value)) {
    return false;
  }

  // null or length array equal 0
  if (value == null || value.length === 0) {
    return true;
  }

  // empty object
  if (typeof value === 'object') {
    let result = true;
    for (const v in value) {
      result = false;
    }

    return result;
  }

  return false;
};
