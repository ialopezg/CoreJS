import { expect } from 'chai';

import { Component } from '../../../common';
import { RuntimeException } from '../../../errors';
import { Injector, InstanceWrapper, ModuleDependencies } from '../../injector';

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
        public depTwo: DependencyTwo) {}
    }

    let moduleDeps: ModuleDependencies;

    beforeEach(() => {
      moduleDeps = {
        instance: null,
        components: new Map<any, InstanceWrapper<any>>(),
      };
      moduleDeps.components.set(MainTest, {
        instance: Object.create(MainTest.prototype),
        resolved: false
      });
      moduleDeps.components.set(DependencyOne, {
        instance: Object.create(DependencyOne.prototype),
        resolved: false
      });
      moduleDeps.components.set(DependencyTwo, {
        instance: Object.create(DependencyOne.prototype),
        resolved: false
      });
    });

    it('should create an instance of component with proper dependencies', () => {
      injector['loadInstance'](MainTest, moduleDeps.components, moduleDeps);
      const { instance } = <InstanceWrapper<MainTest>>(moduleDeps.components.get(MainTest));

      expect(instance.depOne instanceof DependencyOne).to.be.true;
      expect(instance.depTwo instanceof DependencyOne).to.be.true;
      expect(instance instanceof MainTest).to.be.true;
    });

    it('should set "isResolved" property to true after instance initialization', () => {
      injector['loadInstance'](MainTest, moduleDeps.components, moduleDeps);
      const { resolved } = <InstanceWrapper<MainTest>>(moduleDeps.components.get(MainTest));

      expect(resolved).to.be.true;
    });

    it('should throw RuntimeException when type is not stored in collection', () => {
      expect(
        injector['loadInstance'].bind(injector, "Test", moduleDeps.components, moduleDeps)
      ).to.throw(RuntimeException);
    });

  });

  describe('loadPrototypeOfInstance', () => {

    @Component()
    class Test {}

    let moduleDeps: ModuleDependencies;

    beforeEach(() => {
      moduleDeps = {
        instance: null,
        components: new Map<any, InstanceWrapper<any>>(),
      };
      moduleDeps.components.set(Test, {
        instance: Object.create(Test.prototype),
        resolved: false
      });
    });

    it('should create prototype of instance', () => {
      const expectedResult = {
        instance: Object.create(Test.prototype),
        resolved: false
      };
      injector.loadPrototypeOfInstance(Test, moduleDeps.components);

      expect(moduleDeps.components.get(Test)).to.deep.equal(expectedResult);
    });
  });
});
