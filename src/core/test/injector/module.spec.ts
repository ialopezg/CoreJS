import { expect } from 'chai';

import * as sinon from 'sinon';

import { Module } from '../../injector';
import {
  Component,
  Module as ModuleDecorator,
} from '../../../common';
import {
  UnknownExportableComponentException,
} from '../../../errors';

describe('Module', () => {
  let module: Module;

  @ModuleDecorator({}) class TestModule {}
  @Component() class TestComponent {}

  beforeEach(() => {
    module = new Module(TestModule);
  });

  it('should throw "UnknownExportableComponentException" when given exported component is not a part of components array', () => {
    expect(
      () => module.addExportedComponent(TestComponent)
    ).throws(UnknownExportableComponentException);
  });

  it('should add route', () => {
    const collection = new Map();
    const setSpy = sinon.spy(collection, 'set');
    (<any>module)['_controllers'] = collection;

    class TestController {}

    module.addController(TestController);

    expect(setSpy.getCall(0).args).to.deep.equal(['TestController', {
      metaType: TestController,
      instance: null,
      resolved: false,
    }]);
  });

  it('should add component', () => {
    const collection = new Map();
    const setSpy = sinon.spy(collection, 'set');
    (<any>module)['_components'] = collection;

    module.addComponent(TestComponent);

    expect(setSpy.getCall(0).args).to.deep.equal(['TestComponent', {
      metaType: TestComponent,
      instance: null,
      resolved: false,
    }]);
  });
});
