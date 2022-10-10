import { expect } from 'chai';

import { isString } from '../../helpers';

describe('isString', () => {
  it('should return false if a boolean value is passed', () => {
    expect(isString(false)).to.be.false;
    expect(isString(true)).to.be.false;
  });

  it('should return false if a number value is passed', () => {
    expect(isString(10)).to.be.false;
    expect(isString(-10)).to.be.false;
  });

  it('should return true if a string value is passed', () => {
    expect(isString('hi')).to.be.true;
  });
});
