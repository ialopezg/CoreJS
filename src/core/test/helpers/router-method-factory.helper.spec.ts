import { expect } from 'chai';
import { RouterMethodFactory } from '../../helpers';
import { RequestMethod } from '../../../common';

describe('RouterMethodFactory', () => {
  let factory: RouterMethodFactory;
  let target = {
    get: () => {},
    post: () => {},
    all: () => {},
    delete: () => {},
    put: () => {},
  } as any;

  beforeEach(() => {
    factory = new RouterMethodFactory();
  });

  it('should return proper method', () => {
    expect(factory.get(target, RequestMethod.DELETE)).to.equal(target.delete);
    expect(factory.get(target, RequestMethod.POST)).to.equal(target.post);
    expect(factory.get(target, RequestMethod.ALL)).to.equal(target.all);
    expect(factory.get(target, RequestMethod.PUT)).to.equal(target.put);
    expect(factory.get(target, RequestMethod.GET)).to.equal(target.get);
  });
});
