import { expect } from 'chai';
import { isConstructor } from '../../helpers';

describe('isConstructor', () => {
  it('should return true if a constructor function is passed', function () {
    expect(isConstructor(function () {})).to.be.true;
    expect(isConstructor(function foo() {})).to.be.true;
    expect(isConstructor(class {})).to.be.true;
    expect(isConstructor(class Foo {})).to.be.true;
  });

  it('should return false if a non-constructor object is passed', function () {
    class Foo {
      static bar() {}

      bar() {}
    }

    expect(isConstructor(Foo.bar)).to.be.false;
    expect(isConstructor(new Foo().bar())).to.be.false;
  });
});
