import 'reflect-metadata';

import { expect } from 'chai';

import { Controller } from '../../decorators';
import { PATH_METADATA } from '../../constants';

describe('@Controller', () => {
  const metadata = {
    path: 'test',
  };

  @Controller(metadata)
  class TestController {}
  @Controller()
  class EmptyDecoratorController {}
  @Controller()
  class AnotherTestController {}

  it('should decorate type with expected path metadata', () => {
    const path = Reflect.getMetadata(PATH_METADATA, TestController);

    expect(path).to.be.eql(metadata.path);
  });

  it('should set default path when no object passed as param', () => {
    const path = Reflect.getMetadata(PATH_METADATA, EmptyDecoratorController);

    expect(path).to.be.eql('/');
  });

  it('should set default path when empty passed as param', () => {
    const path = Reflect.getMetadata(PATH_METADATA, AnotherTestController);

    expect(path).to.be.eql('/');
  });
});
