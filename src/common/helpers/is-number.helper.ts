/**
 * Determines whether the passed value is number. If  needed, the parameter is first converted to a number.
 * Supports: Numeric literal as DecimalLiteral, BinaryIntegerLiteral, OctalIntegerLiteral, and HexIntegerLiteral
 *
 * @param value The value to be tested for finiteness.
 *
 * @returns false if the argument is (or will be coerced to) positive or negative Infinity or NaN or undefined; otherwise, true.
 */
export const isNumber = (value: any): boolean => {
  if (typeof value === 'number' && isFinite(value)) {
    return true;
  }

  return Object.prototype.toString.apply(value) === '[object Number]';
};
