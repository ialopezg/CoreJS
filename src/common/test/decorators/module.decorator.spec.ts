import 'reflect-metadata';
import { expect } from 'chai';
import { InvalidModuleConfigurationException } from '../../../errors';

import { Module } from '../../decorators';
import { ModuleMetadata } from '../../interfaces';

describe('@Module', () => {
  const metadata: ModuleMetadata = {
    modules: ['AnotherTestModule'],
    components: ['TestComponent'],
    controllers: ['TestController'],
    exports: ['TestComponent'],
  };

  @Module(metadata)
  class TestModule {}

  it('should decorate type with expected module metadata', () => {
    const modules = Reflect.getMetadata('modules', TestModule);
    const components = Reflect.getMetadata('components', TestModule);
    const exports = Reflect.getMetadata('exports', TestModule);
    const controllers = Reflect.getMetadata('controllers', TestModule);

    expect(modules).to.be.eql(metadata.modules);
    expect(components).to.be.eql(metadata.components);
    expect(controllers).to.be.eql(metadata.controllers);
    expect(exports).to.be.eql(metadata.exports);
  });

  it('should throw exception when module properties are invalid', () => {
    const invalidProps = {
      ...metadata,
      test: [],
    };

    expect(Module.bind(null, invalidProps)).to.throw(InvalidModuleConfigurationException);
  });
});
