import 'reflect-metadata';

import { expect } from 'chai';

import { Module } from '../../decorators';
import { InvalidModuleConfigurationException } from '../../../errors';
import { MODULE_METADATA } from '../../constants';

describe('@Module', () => {
  const moduleProps = {
    modules: ['Test'],
    components: ['Test'],
    exports: ['Test'],
    controllers: ['Test'],
  };

  @Module(moduleProps)
  class TestModule {}

  it('should enhance transport with expected module metadata', () => {
    const modules = Reflect.getMetadata(MODULE_METADATA.MODULES, TestModule);
    const controllers = Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, TestModule);
    const components = Reflect.getMetadata(MODULE_METADATA.COMPONENTS, TestModule);
    const exports = Reflect.getMetadata(MODULE_METADATA.EXPORTS, TestModule);

    expect(modules).to.be.eql(moduleProps.modules);
    expect(components).to.be.eql(moduleProps.components);
    expect(controllers).to.be.eql(moduleProps.controllers);
    expect(exports).to.be.eql(moduleProps.exports);
  });

  it('should throw exception when module properties are invalid', () => {
    const invalidProps = {
      ...moduleProps,
      test: [],
    };

    expect(Module.bind(null, invalidProps)).to.throw(InvalidModuleConfigurationException);
  });
});
