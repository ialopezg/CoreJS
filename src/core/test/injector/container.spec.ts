import { expect } from 'chai';
import * as sinon from 'sinon';

import { Module } from '../../../common';
import { UnknownModuleException } from '../../../errors/exceptions';
import { Container } from '../../injector';

describe('Container', () => {
  let container: Container;

  @Module({})
  class TestModule { }

  beforeEach(() => {
    container = new Container();
  });

  it('should not add module if already exists in collection', () => {
    const modules = new Map();
    const setSpy = sinon.spy(modules, 'set');
    // eslint-disable-next-line dot-notation
    (container as any)['modules'] = modules;

    container.addModule(TestModule);
    container.addModule(TestModule);

    expect(setSpy.calledOnce).to.be.true;
  });

  it('should "addComponent" throw "UnknownModuleException" when module is not stored in collection', () => {
    expect(() => container.addComponent(null, TestModule)).throw(UnknownModuleException);
  });

  it('should "addRoute" throw "UnknownModuleException" when module is not stored in collection', () => {
    expect(() => container.addController(null, TestModule)).throw(UnknownModuleException);
  });

  it('should "addExportedComponent" throw "UnkownModuleException" when module is not stored in collection', () => {
    expect(() => container.addExportedComponent(null, TestModule)).throw(UnknownModuleException);
  });
});
