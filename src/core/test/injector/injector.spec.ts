import { expect } from 'chai';

import { Component } from '../../../common';
import { RuntimeException } from '../../../errors';
import { Injector, InstanceWrapper, Module } from '../../injector';

describe('Injector', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
  });

  describe('loadInstance', () => {
    @Component()
    class DependencyOne {}

    @Component()
    class DependencyTwo {}

    @Component()
    class MainTest {
      constructor(
        public depOne: DependencyOne,
        public depTwo: DependencyTwo,
      ) {}
    }

    let moduleDeps: Module;

    beforeEach(() => {
      moduleDeps = new Module(DependencyTwo);
      moduleDeps.components.set('MainTest', {
        metaType: MainTest,
        instance: Object.create(MainTest.prototype),
        resolved: false,
      });
      moduleDeps.components.set('DependencyOne', {
        metaType: DependencyOne,
        instance: Object.create(DependencyOne.prototype),
        resolved: false,
      });
      moduleDeps.components.set('DependencyTwo', {
        metaType: DependencyTwo,
        instance: Object.create(DependencyOne.prototype),
        resolved: false,
      });
    });

    it('should create an instance of component with proper dependencies', () => {
      injector['loadInstance'](MainTest, moduleDeps.components, moduleDeps);
      const { instance } = <InstanceWrapper<MainTest>>(moduleDeps.components.get('MainTest'));

      expect(instance.depOne instanceof DependencyOne).to.be.true;
      expect(instance.depTwo instanceof DependencyOne).to.be.true;
      expect(instance instanceof MainTest).to.be.true;
    });

    it('should set "isResolved" property to true after instance initialization', () => {
      injector['loadInstance'](MainTest, moduleDeps.components, moduleDeps);
      const { resolved } = <InstanceWrapper<MainTest>>(moduleDeps.components.get('MainTest'));

      expect(resolved).to.be.true;
    });

    it('should throw RuntimeException when type is not stored in collection', () => {
      expect(
        injector['loadInstance'].bind(injector, 'Test', moduleDeps.components, moduleDeps),
      ).to.throw(RuntimeException);
    });

  });

  describe('loadPrototypeOfInstance', () => {

    @Component()
    class TestComponent {}

    let moduleDeps: Module;

    beforeEach(() => {
      moduleDeps = new Module(TestComponent);
      moduleDeps.components.set('TestComponent', {
        metaType: TestComponent,
        instance: Object.create(TestComponent.prototype),
        resolved: false,
      });
    });

    it('should create prototype of instance', () => {
      const expectedResult = {
        metaType: TestComponent,
        instance: Object.create(TestComponent.prototype),
        resolved: false,
      };
      injector.loadPrototypeOfInstance(TestComponent, moduleDeps.components);

      expect(moduleDeps.components.get('TestComponent')).to.deep.equal(expectedResult);
    });
  });
});
