import * as sinon from 'sinon';

import { AppModule, Component, Controller, Module } from '../../common';
import { AppContainer } from '../injector';
import { DependencyScanner } from '../scanner';

describe('DependencyScanner', () => {
  @Component()
  class TestComponent {}

  @Controller({ path: '' })
  class TestController {}

  @Module({
    components: [TestComponent],
    controllers: [TestController],
    exports: [TestComponent],
  })
  class AnotherTestModule implements AppModule {}

  @Module({
    modules: [AnotherTestModule],
    components: [TestComponent],
    controllers: [TestController],
  })
  class TestModule implements AppModule {}

  let scanner: DependencyScanner;
  let mockContainer: sinon.SinonMock;
  let container: AppContainer;

  before(() => {
    container = new AppContainer();
    mockContainer = sinon.mock(container);
  });

  beforeEach(() => {
    scanner = new DependencyScanner(container);
  });

  afterEach(() => {
    mockContainer.restore();
  });

  it('should "storeModule" called twice (2 modules) container method "addModule"', () => {
    const expectation = mockContainer.expects('addModule').twice();

    scanner.scan(<AppModule>TestModule);

    expectation.verify();
  });

  it('should "storeComponent" called twice (2 components) container method "addComponent"', () => {
    const expectation = mockContainer.expects('addComponent').twice();
    const stub = sinon.stub(scanner, 'storeExportedComponent');

    scanner.scan(<AppModule>TestModule);

    expectation.verify();
    stub.restore();
  });

  it('should "storeController" called twice (2 controllers) container method "addController"', () => {
    const expectation = mockContainer.expects('addController').twice();

    scanner.scan(<AppModule>TestModule);

    expectation.verify();
  });

  it('should "storeExportedComponent" called once (1 component) container method "addExportedComponent"', () => {
    const expectation = mockContainer.expects('addExportedComponent').once();

    scanner.scan(<AppModule>TestModule);

    expectation.verify();
  });
});
