import 'reflect-metadata';
import { expect } from 'chai';

import { InvalidModuleConfigurationException } from '../../../errors/exceptions';
import { metadata } from '../../constants';
import { Module } from '../../decorators';
import { ModuleMetadata } from '../../interfaces';

describe('@Module', () => {
  const props: ModuleMetadata = {
    modules: ['AnotherTestModule'],
    components: ['TestComponent'],
    controllers: ['TestController'],
    exports: ['TestComponent'],
  };

  @Module(props)
  class TestModule {}

  it('should enhance transport with expected module metadata', () => {
    const modules = Reflect.getMetadata(metadata.MODULES, TestModule);
    const controllers = Reflect.getMetadata(metadata.CONTROLLERS, TestModule);
    const components = Reflect.getMetadata(metadata.COMPONENTS, TestModule);
    const exports = Reflect.getMetadata(metadata.EXPORTS, TestModule);

    expect(modules).to.be.eql(props.modules);
    expect(controllers).to.be.eql(props.controllers);
    expect(components).to.be.eql(props.components);
    expect(exports).to.be.eql(props.exports);
  });

  it('should throw exception when module properties are invalid', () => {
    const invalidProps = {
      ...props,
      test: [],
    };

    expect(Module.bind(null, invalidProps)).to.throw(InvalidModuleConfigurationException);
  });
});
