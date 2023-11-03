import 'reflect-metadata';

import { expect } from 'chai';

import { Inject } from '../../decorators';
import { PARAM_TYPES_METADATA } from '../../constants';

describe('@Inject', () => {
  const dependencies = ['dependency1', 'dependency2'];

  @Inject(dependencies)
  class TestClass {}

  it('should enhance class with expected dependency array', () => {
    const metadata = Reflect.getMetadata(PARAM_TYPES_METADATA, TestClass);

    expect(metadata).to.be.eql(dependencies);
  });
});
