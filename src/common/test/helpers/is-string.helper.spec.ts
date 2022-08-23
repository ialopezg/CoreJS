import { isString } from '../../helpers';

describe('isString', () => {
  it('should return false if a boolean value is passed', () => {
    expect(isString(false)).toBe(false);
    expect(isString(true)).toBe(false);
  });

  it('should return false if a number value is passed', () => {
    expect(isString(10)).toBe(false);
    expect(isString(-10)).toBe(false);
  });

  it('should return true if a string value is passed', () => {
    expect(isString('hi')).toBe(true);
  });
});
