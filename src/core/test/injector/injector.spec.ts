import { expect } from 'chai';

import { InstanceWrapper, Injector } from '../../injector';
import { Component, RuntimeException } from '../../../common';
import { Module } from '../../injector/module';

describe('Injector', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
  });

  describe('loadInstance', () => {
    @Component()
    class DependencyOne { }

    @Component()
    class DependencyTwo { }

    @Component()
    class MainComponent {
      constructor(
        public depOne: DependencyOne,
        public depTwo: DependencyTwo) { }
    }

    let moduleDeps: Module;

    beforeEach(() => {
      moduleDeps = new Module(DependencyTwo);
      moduleDeps.components.set('MainComponent', {
        metaType: MainComponent,
        instance: Object.create(MainComponent.prototype),
        resolved: false,
      });
      moduleDeps.components.set('DependencyOne', {
        metaType: DependencyOne,
        instance: Object.create(DependencyOne.prototype),
        resolved: false,
      });
      moduleDeps.components.set('DependencyTwo', {
        metaType: DependencyTwo,
        instance: Object.create(DependencyTwo.prototype),
        resolved: false,
      });
    });

    it('should create an instance of component with proper dependencies', () => {
      injector.loadInstance(MainComponent, moduleDeps.components, moduleDeps);
      const { instance } = <InstanceWrapper<MainComponent>>(moduleDeps.components.get('MainComponent'));

      expect(instance.depOne instanceof DependencyOne).to.be.true;
      expect(instance.depTwo instanceof DependencyTwo).to.be.true;
      expect(instance instanceof MainComponent).to.be.true;
    });

    it('should set "resolved" property to true after instance initialization', () => {
      injector.loadInstance(MainComponent, moduleDeps.components, moduleDeps);
      const { resolved } = <InstanceWrapper<MainComponent>>(moduleDeps.components.get('MainComponent'));

      expect(resolved).to.be.true;
    });

    it('should throw RuntimeException when type is not stored in collection', () => {
      expect(
        injector.loadInstance.bind(injector, 'Test', moduleDeps.components, moduleDeps),
      ).to.throw(RuntimeException);
    });
  });

  describe('loadPrototypeOfInstance', () => {
    @Component()
    class TestComponent { }

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
        instance: Object.create(TestComponent.prototype),
        resolved: false,
        metaType: TestComponent,
      };
      injector.loadPrototypeOfInstance(TestComponent, moduleDeps.components);

      expect(moduleDeps.components.get('TestComponent')).to.deep.equal(expectedResult);
    });
  });
});
