import { expect } from 'chai';

import { isBoolean } from '../../helpers';

describe('isBoolean', () => {
  it('should return true if a boolean value is passed', function () {
    expect(isBoolean(false)).to.be.true;
    expect(isBoolean(true)).to.be.true;
  });

  it('should return false if a string with boolean value is passed', function () {
    expect(isBoolean('false')).to.be.false;
    expect(isBoolean('true')).to.be.false;
  });

  it('should return false if a non boolean value is passed', function () {
    expect(isBoolean(0)).to.be.false;
    expect(isBoolean(1)).to.be.false;
    expect(isBoolean('hi')).to.be.false;
  });
});
