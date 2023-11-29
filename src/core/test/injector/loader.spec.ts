import { expect } from 'chai';
import * as sinon from 'sinon';

import { Injector, InstanceLoader, ModuleContainer } from '../../injector';
import { Component, Controller, LoggerService } from '../../../common';
import { ApplicationMode } from '../../../common/enums/application-mode.enum';

describe('InstanceLoader', () => {
  let loader: InstanceLoader;
  let container: ModuleContainer;
  let mockContainer: sinon.SinonMock;

  @Controller({ path: '' })
  class TestController {}

  @Component()
  class TestComponent {}

  before(() => LoggerService.setMode(ApplicationMode.TEST));

  beforeEach(() => {
    container = new ModuleContainer();
    loader = new InstanceLoader(container);
    mockContainer = sinon.mock(container);
  });

  it('should call "loadPrototypeOfInstance" for each component and controller in each module', () => {
    const injector = new Injector();
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      controllers: new Map(),
    };
    const componentWrapper = {
      name: 'TestComponent',
      instance: null,
      metaType: TestComponent,
    };
    const controllerWrapper = {
      name: 'TestController',
      instance: null,
      metaType: TestController,
    };
    module.components.set('TestComponent', componentWrapper);
    module.controllers.set('TestController', controllerWrapper);

    const modules = new Map();
    modules.set('TestModule', module);
    mockContainer.expects('getModules').returns(modules);

    const loadComponentPrototypeStub = sinon.stub(injector, 'loadPrototypeOfInstance');

    sinon.stub(injector, 'loadInstanceOfComponent');
    sinon.stub(injector, 'loadInstanceOfController');

    loader.initialize();
    expect(loadComponentPrototypeStub.calledWith(componentWrapper, module.components)).to.be.true;
    expect(loadComponentPrototypeStub.calledWith(controllerWrapper, module.controllers)).to.be.true;
  });

  it('should call "loadInstanceOfComponent" for each component in each module', () => {
    const injector = new Injector();
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      controllers: new Map(),
    };
    const componentWrapper = {
      name: 'TestComponent',
      instance: null,
      metaType: TestComponent,
    };
    module.components.set('TestComponent', componentWrapper);

    const modules = new Map();
    modules.set('TestComponent', module);
    mockContainer.expects('getModules').returns(modules);

    const loadComponentStub = sinon.stub(injector, 'loadInstanceOfComponent');
    sinon.stub(injector, 'loadInstanceOfController');

    loader.initialize();
    expect(loadComponentStub.calledWith(module.components.get('TestComponent'), module)).to.be.true;
  });

  it('should call "loadInstanceOfController" for each controller in each module', () => {
    const injector = new Injector();
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      controllers: new Map(),
    };
    const controllerWrapper = {
      name: 'TestController',
      instance: null,
      metaType: TestController,
    };
    module.controllers.set('TestController', controllerWrapper);

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    sinon.stub(injector, 'loadInstanceOfComponent');
    const loadRoutesStub = sinon.stub(injector, 'loadInstanceOfController');

    loader.initialize();

    expect(loadRoutesStub.calledWith(module.controllers.get('TestController'), module)).to.be.true;
  });
});
