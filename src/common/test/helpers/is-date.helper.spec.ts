import { expect } from 'chai';

import { isDate } from '../../helpers';

describe('isDate', () => {
  it('should return true if a date object is passed', function () {
    const value = new Date(99, 5, 24, 11, 33, 30, 0);

    expect(isDate(value)).to.be.true;
  });

  it('should return true if a date object with timestamp is passed', function () {
    const value = new Date(86400000);

    expect(isDate(value)).to.be.true;
  });

  it('should return false if a long date string is passed', function () {
    const value = 'May 5, 1999 11:33:30';

    expect(isDate(value)).to.be.false;
  });

  it('should return false if a non date is passed', function () {
    const value = 'May 5, 1999 11:33:30';

    expect(isDate([1, 2, 4, 0])).to.be.false;
  });
});
