import { expect } from 'chai';
import * as sinon from 'sinon';

import { Container, Injector, InstanceLoader } from '../../injector';
import { AppMode, Component, Controller, LoggerService } from '../../../common';
import { Module } from '../../injector/module';

describe('InstanceLoader', () => {
  let loader: InstanceLoader;
  let container: Container;
  let mockContainer: sinon.SinonMock;

  @Controller({ path: '' })
  class TestController { }

  @Component()
  class TestComponent { }

  before(() => LoggerService.setMode(AppMode.TEST));

  beforeEach(() => {
    container = new Container();
    loader = new InstanceLoader(container);
    mockContainer = sinon.mock(container);
  });

  it('should call "loadPrototypeOfInstance" for each component and route in each module', () => {
    const injector = new Injector();
    // eslint-disable-next-line dot-notation
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      controllers: new Map(),
    };
    module.components.set('TestComponent', { instance: null, metaType: TestComponent });
    module.controllers.set('TestRoute', { instance: null, metaType: TestController });

    const modules = new Map();
    modules.set('TestModule', module);
    mockContainer.expects('getModules').returns(modules);

    const loadComponentPrototypeStub = sinon.stub(injector, 'loadPrototypeOfInstance');

    sinon.stub(injector, 'loadInstanceOfController');
    sinon.stub(injector, 'loadInstanceOfComponent');

    loader.createInstancesOfDependencies();

    expect(loadComponentPrototypeStub.calledWith(TestComponent, module.components)).to.be.true;
    expect(loadComponentPrototypeStub.calledWith(TestController, module.controllers)).to.be.true;
  });

  it('should call "loadInstanceOfComponent" for each component in each module', () => {
    const injector = new Injector();
    // eslint-disable-next-line dot-notation
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      controllers: new Map(),
    };
    module.components.set('TestComponent', { instance: null, metaType: TestComponent });

    const modules = new Map();
    modules.set('TestModule', module);
    mockContainer.expects('getModules').returns(modules);

    const loadComponentStub = sinon.stub(injector, 'loadInstanceOfComponent');
    sinon.stub(injector, 'loadInstanceOfController');

    loader.createInstancesOfDependencies();

    expect(loadComponentStub.calledWith(TestComponent, <Module>module)).to.be.true;
  });

  it('should call "loadInstanceOfController" for each route in each module', () => {
    const injector = new Injector();
    // eslint-disable-next-line dot-notation
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      controllers: new Map(),
    };
    module.controllers.set('TestController', { instance: null, metaType: TestController });

    const modules = new Map();
    modules.set('TestModule', module);
    mockContainer.expects('getModules').returns(modules);

    sinon.stub(injector, 'loadInstanceOfComponent');
    const loadRoutesStub = sinon.stub(injector, 'loadInstanceOfController');

    loader.createInstancesOfDependencies();

    expect(loadRoutesStub.calledWith(TestController, <Module>module)).to.be.true;
  });
});
