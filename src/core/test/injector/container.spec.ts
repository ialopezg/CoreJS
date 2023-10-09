import { expect } from 'chai';

import { InstanceWrapper, ModuleContainer, ModuleDependencies } from '../../injector';
import { IModule, Module } from '../../../common';
import { IController, IInjectable } from '../../../common';
import { UnknownExportableComponentException } from '../../../errors';

describe('ModuleContainer', () => {
  let container: ModuleContainer;

  @Module({})
  class TestModule {}

  beforeEach(() => {
    container = new ModuleContainer();
  });

  it('should create module instance and collections for dependencies', () => {
    container.addModule(TestModule);

    expect(container['modules'].get(<IModule>TestModule)).to.be.deep.equal({
      instance: new TestModule(),
      relatedModules: new Set<ModuleDependencies>(),
      components: new Map<IInjectable, InstanceWrapper<any>>(),
      routes: new Map<IController, InstanceWrapper<IController>>(),
      exports: new Set<IInjectable>(),
    });
  });


  it('should throw "UnknownExportException" when given exported component is not a part of components array', () => {
    container.addModule(TestModule);

    expect(
      container.addExportedComponent.bind(container, <any>'Test', TestModule),
    ).throws(UnknownExportableComponentException);
  });
});
