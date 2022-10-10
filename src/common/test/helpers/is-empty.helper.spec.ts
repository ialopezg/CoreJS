import { expect } from 'chai';

import { isEmpty } from '../../helpers';

describe('isEmpty', () => {
  it('should return true when empty object is passed', function () {
    expect(isEmpty(undefined)).to.be.true;
  });

  it('should return true when empty object is passed', function () {
    expect(isEmpty({})).to.be.true;
  });

  it('should return true when empty array is passed', function () {
    expect(isEmpty([])).to.be.true;
  });

  it('should return true when empty string is passed', function () {
    expect(isEmpty('')).to.be.true;
  });

  it('should return false when not empty string is passed', function () {
    expect(isEmpty('Not empty')).to.be.false;
  });

  it('should return false when not empty object is passed', function () {
    expect(isEmpty({ notEmpty: true })).to.be.false;
  });

  it('should return false when a function, boolean, date, or number value is passed', function () {
    expect(isEmpty(true)).to.be.false;
    expect(isEmpty(1)).to.be.false;
    expect(isEmpty(new Date())).to.be.false;
  });
});
