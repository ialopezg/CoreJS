import { isBoolean } from '../../helpers';

describe('isBoolean', () => {
  it('should return true if a boolean value is passed', function () {
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(true)).toBe(true);
  });

  it('should return false if a string with boolean value is passed', function () {
    expect(isBoolean('false')).toBe(false);
    expect(isBoolean('true')).toBe(false);
  });

  it('should return false if a non boolean value is passed', function () {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean('hi')).toBe(false);
  });
});
