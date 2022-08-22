import { isNumber } from '../../helpers';

describe('isNumber', () => {
  it('should return true when integer value passed', () => {
    expect(isNumber(10)).toBe(true);
    expect(isNumber(0)).toBe(true);
  });

  it('should return true when decimal value passed', function () {
    expect(isNumber(10.2)).toBe(true);
    expect(isNumber(10.5)).toBe(true);
    expect(isNumber(0.0)).toBe(true);
  });

  it('should return true when signed value passed', function () {
    expect(isNumber(-10)).toBe(true);
    expect(isNumber(-10.5)).toBe(true);
    expect(isNumber(-0.0)).toBe(true);
    expect(isNumber(+10)).toBe(true);
    expect(isNumber(+10.5)).toBe(true);
    expect(isNumber(+0.0)).toBe(true);
  });

  it('should return true when exponential value passed', function () {
    expect(isNumber(1e5)).toBe(true);
  });

  it('should return true when binary value passed', function () {
    expect(isNumber(0b0010)).toBe(true);
  });

  it('should return true when hexadecimal value passed', function () {
    expect(isNumber(0xA)).toBe(true);
  });

  it('should return true when octal value passed', function () {
    expect(isNumber(0o12)).toBe(true);
  });

  it('should return true when NaN value passed', function () {
    expect(isNumber(NaN)).toBe(true);
  });

  it('should return false when a string value passed', function () {
    expect(isNumber('NaN')).toBe(false);
    expect(isNumber('0.10')).toBe(false);
    expect(isNumber('.10')).toBe(false);
  });
});
