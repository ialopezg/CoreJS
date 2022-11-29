import { expect } from 'chai';
import { IRoute } from 'express';
import { RequestMethod } from '../../../common';
import { RouterMethodFactory } from '../../helpers';

describe('RouterMethodFactory', () => {
  let factory: RouterMethodFactory;
  const target: any = {
    all: () => {},
    delete: () => {},
    get: () => {},
    post: () => {},
    put: () => {},
  };

  beforeEach(() => {
    factory = new RouterMethodFactory();
  });

  it('should return proper method', () => {
    expect(factory.get(target, RequestMethod.ALL)).to.equal(target.all);
    expect(factory.get(target, RequestMethod.DELETE)).to.equal(target.delete);
    expect(factory.get(target, RequestMethod.GET)).to.equal(target.get);
    expect(factory.get(target, RequestMethod.POST)).to.equal(target.post);
    expect(factory.get(target, RequestMethod.PUT)).to.equal(target.put);
  });
});
