import 'reflect-metadata';

import { expect } from 'chai';

import { PARAM_TYPES_METADATA } from '../../constants';
import { Inject } from '../../decorators';

describe('@Inject', () => {
  const dependencies = ['dependency1', 'dependency2'];

  @Inject(dependencies)
  class Test {}

  it('should enhance class with expected dependency array', () => {
    const metadata = Reflect.getMetadata(PARAM_TYPES_METADATA, Test);

    expect(metadata).to.be.eql(dependencies);
  });
});
