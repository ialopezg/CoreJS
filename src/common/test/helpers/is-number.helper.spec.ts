import { expect } from 'chai';

import { isNumber } from '../../helpers';

describe('isNumber', () => {
  it('should return true when integer value passed', () => {
    expect(isNumber(10)).to.be.true;
    expect(isNumber(0)).to.be.true;
  });

  it('should return true when decimal value passed', function () {
    expect(isNumber(10.2)).to.be.true;
    expect(isNumber(10.5)).to.be.true;
    expect(isNumber(0.0)).to.be.true;
  });

  it('should return true when signed value passed', function () {
    expect(isNumber(-10)).to.be.true;
    expect(isNumber(-10.5)).to.be.true;
    expect(isNumber(-0.0)).to.be.true;
    expect(isNumber(+10)).to.be.true;
    expect(isNumber(+10.5)).to.be.true;
    expect(isNumber(+0.0)).to.be.true;
  });

  it('should return true when exponential value passed', function () {
    expect(isNumber(1e5)).to.be.true;
  });

  it('should return true when binary value passed', function () {
    expect(isNumber(0b0010)).to.be.true;
  });

  it('should return true when hexadecimal value passed', function () {
    expect(isNumber(0xA)).to.be.true;
  });

  it('should return true when octal value passed', function () {
    expect(isNumber(0o12)).to.be.true;
  });

  it('should return true when NaN value passed', function () {
    expect(isNumber(NaN)).to.be.true;
  });

  it('should return false when a string value passed', function () {
    expect(isNumber('NaN')).to.be.false;
    expect(isNumber('0.10')).to.be.false;
    expect(isNumber('.10')).to.be.false;
  });
});
