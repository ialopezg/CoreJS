import { expect } from 'chai';
import * as sinon from 'sinon';

import { Injector, InstanceLoader, ModuleContainer } from '../../injector';
import { Component, Controller } from '../../../common';

describe('InstanceLoader', () => {
  let loader: InstanceLoader;
  let container: ModuleContainer;
  let mockContainer: sinon.SinonMock;

  @Controller({ path: '' })
  class TestRoute {}

  @Component()
  class TestComponent {}

  beforeEach(() => {
    container = new ModuleContainer();
    loader = new InstanceLoader(container);
    mockContainer = sinon.mock(container);
  });

  it('should call "loadPrototypeOfInstance" for each component and route in each module', () => {
    const injector = new Injector();
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      routes: new Map(),
    };
    module.components.set(TestComponent, { instance: null });
    module.routes.set(TestRoute, { instance: null });

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    const loadComponentPrototypeStub = sinon.stub(injector, 'loadPrototypeOfInstance');

    sinon.stub(injector, 'loadInstanceOfController');
    sinon.stub(injector, 'loadInstanceOfComponent');

    loader.initialize();
    expect(loadComponentPrototypeStub.calledWith(TestComponent, module.components)).to.be.true;
    expect(loadComponentPrototypeStub.calledWith(TestRoute, module.components)).to.be.true;
  });

  it('should call "loadInstanceOfComponent" for each component in each module', () => {
    const injector = new Injector();
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      routes: new Map(),
    };
    module.components.set(TestComponent, { instance: null });

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    const loadComponentStub = sinon.stub(injector, 'loadInstanceOfComponent');
    sinon.stub(injector, 'loadInstanceOfController');

    loader.initialize();
    expect(loadComponentStub.calledWith(TestComponent, module)).to.be.true;
  });

  it('should call "loadInstanceOfRoute" for each route in each module', () => {
    const injector = new Injector();
    loader['injector'] = injector;

    const module = {
      components: new Map(),
      routes: new Map(),
    };
    module.routes.set(TestRoute, { instance: null });

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    sinon.stub(injector, 'loadInstanceOfComponent');
    const loadRoutesStub = sinon.stub(injector, 'loadInstanceOfController');

    loader.initialize();
    expect(loadRoutesStub.calledWith(TestRoute, module)).to.be.true;
  });
});
