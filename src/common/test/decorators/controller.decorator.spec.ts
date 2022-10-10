import 'reflect-metadata';

import { expect } from 'chai';

import { Controller } from '../../decorators';
import { ControllerMetadata } from '../../interfaces';

describe('@Controller', () => {
  const metadata: ControllerMetadata = { path: 'test' };

  @Controller(metadata)
  class TestController {}

  @Controller()
  class AnotherTestController {}

  it('should decorate type with expected path metadata', () => {
    const path = Reflect.getMetadata('path', TestController);

    expect(path).to.be.eql(metadata.path);
  });

  it('should set default path when no object passed as param', () => {
    const path = Reflect.getMetadata('path', AnotherTestController);

    expect(path).to.be.eql('/');
  });

  it('should set default path when empty passed as param', () => {
    const path = Reflect.getMetadata('path', AnotherTestController);

    expect(path).to.be.eql('/');
  });
});
