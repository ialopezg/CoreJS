import 'reflect-metadata';

import { expect } from 'chai';

import { ProvideValues } from '../../decorators';

describe('ProvideValues', () => {
  let type: any;
  const data = { test: [1, 2, 3] };

  class Test {}

  beforeEach(() => {
    type = ProvideValues(data)(Test);
  });

  it('should enrich prototype with given values', () => {
    expect(type.prototype).to.contain(data);
  });

  it('should set name of meta type', () => {
    expect(type.name).to.eq(Test.name + JSON.stringify(data));
  });
});
