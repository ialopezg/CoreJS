import 'reflect-metadata';

import { expect } from 'chai';
import { PATH_METADATA } from '../../constants';

import { Controller } from '../../decorators';
import { ControllerMetadata } from '../../interfaces';

describe('@Controller', () => {
  const metadata: ControllerMetadata = { path: 'test' };

  @Controller(metadata)
  class TestController {}

  @Controller()
  class AnotherTestController {}

  @Controller()
  class EmptyDecoratorController {}

  it('should enhance transport with expected path metadata', () => {
    const path = Reflect.getMetadata(PATH_METADATA, TestController);

    expect(path).to.be.eql(metadata.path);
  });

  it('should set default path when no object passed as param', () => {
    const path = Reflect.getMetadata(PATH_METADATA, AnotherTestController);

    expect(path).to.be.eql('/');
  });

  it('should set default path when empty passed as param', () => {
    const path = Reflect.getMetadata(PATH_METADATA, EmptyDecoratorController);

    expect(path).to.be.eql('/');
  });
});
