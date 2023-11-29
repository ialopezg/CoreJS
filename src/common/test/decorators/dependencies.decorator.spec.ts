import 'reflect-metadata';

import { expect } from 'chai';

import { DESIGN_PARAM_TYPES_METADATA } from '../../constants';
import { Dependencies } from '../../decorators';

describe('@Dependencies', () => {
  const dependencies = ['dependency1', 'dependency2'];

  @Dependencies(dependencies)
  class TestClass {}

  it('should enhance class with expected dependency array', () => {
    const metadata = Reflect.getMetadata(DESIGN_PARAM_TYPES_METADATA, TestClass);

    expect(metadata).to.be.eql(dependencies);
  });
});
