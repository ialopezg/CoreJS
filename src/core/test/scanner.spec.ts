import * as sinon from 'sinon';

import { Component, Controller, IModule, Module } from '../../common';
import { DependencyScanner } from '../scanner';
import { ModuleContainer } from '../injector';

describe('DependencyScanner', () => {
  @Component()
  class TestComponent {}

  @Controller({ path: '' })
  class TestRoute {}

  @Module({
    components: [TestComponent],
    controllers: [TestRoute],
    exports: [TestComponent],
  })
  class AnotherTestModule implements IModule {}

  @Module({
    modules: [AnotherTestModule],
    components: [TestComponent],
    controllers: [TestRoute],
  })
  class TestModule implements IModule {}

  let scanner: DependencyScanner;
  let mockContainer: sinon.SinonMock;
  let container: ModuleContainer;

  before(() => {
    container = new ModuleContainer();
    mockContainer = sinon.mock(container);
  });

  beforeEach(() => {
    scanner = new DependencyScanner(container);
  });

  afterEach(() => {
    mockContainer.restore();
  });

  it('should "registerModule" call twice (2 modules) container method "addModule"', () => {
    const expectation = mockContainer.expects('addModule').twice();
    scanner.scan(TestModule);

    expectation.verify();
  });

  it('should "registerComponent" call twice (2 components) container method "addComponent"', () => {
    const expectation = mockContainer.expects('addComponent').twice();
    const stub = sinon.stub(scanner, 'registerExportedComponent');

    scanner.scan(TestModule);

    expectation.verify();
    stub.restore();
  });

  it('should "registerController" call twice (2 components) container method "addController"', () => {
    const expectation = mockContainer.expects('addController').twice();
    scanner.scan(TestModule);

    expectation.verify();
  });

  it('should "registerExportedComponent" call once (1 component) container method "addExportedComponent"', () => {
    const expectation = mockContainer.expects('addExportedComponent').once();
    scanner.scan(TestModule);

    expectation.verify();
  });
});
