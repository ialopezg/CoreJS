import { expect } from 'chai';

import { AppModule, Module } from '../../../common';
import { Controller, Injectable } from '../../../common/interfaces';
import { UnknownExportException } from '../../../errors';
import { AppContainer, InstanceWrapper, ModuleDependency } from '../../injector';

describe('AppContainer', () => {
  let container: AppContainer;

  @Module({})
  class TestModule {}

  beforeEach(() => {
    container = new AppContainer();
  });

  it('should create a module and collections for dependencies', () => {
    container.addModule(TestModule);

    // eslint-disable-next-line dot-notation
    expect(container['modules'].get(<AppModule>TestModule)).to.be.eql({
      instance: new TestModule(),
      modules: new Set<ModuleDependency>(),
      components: new Map<Injectable, InstanceWrapper<Injectable>>(),
      controllers: new Map<Controller, InstanceWrapper<Controller>>(),
      exports: new Set<Injectable>(),
    });
  });

  it('should throw "UnknownExportException" when given exported component is not part of component array', () => {
    container.addModule(TestModule);

    expect(container.addExportedComponent.bind(container, <any>'Test', TestModule)).throws(UnknownExportException);
  });
});
