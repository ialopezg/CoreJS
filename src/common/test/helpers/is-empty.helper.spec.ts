import { isEmpty } from '../../helpers';

describe('isEmpty', () => {
  it('should return true when empty object is passed', function () {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true when empty object is passed', function () {
    expect(isEmpty({})).toBe(true);
  });

  it('should return true when empty array is passed', function () {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true when empty string is passed', function () {
    expect(isEmpty('')).toBe(true);
  });

  it('should return false when not empty string is passed', function () {
    expect(isEmpty('Not empty')).toBe(false);
  });

  it('should return false when not empty object is passed', function () {
    expect(isEmpty({ notEmpty: true })).toBe(false);
  });

  it('should return false when a function, boolean, date, or number value is passed', function () {
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(new Date())).toBe(false);
  });
});
