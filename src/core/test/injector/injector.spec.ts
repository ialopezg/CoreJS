import { expect } from 'chai';

import { Component } from '../../../common';
import { RuntimeException } from '../../../common/exceptions/runtime.exception';
import { Injector, InstanceWrapper, ModuleDependency } from '../../injector';

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
    class MainComponent {
      constructor(
        public dependencyOne: DependencyOne,
        public dependencyTwo: DependencyTwo,
      ) {}
    }

    let module: ModuleDependency;

    beforeEach(() => {
      module = {
        instance: null,
        components: new Map<any, InstanceWrapper<any>>(),
      };
      module.components.set(MainComponent, {
        instance: Object.create(MainComponent.prototype),
        resolved: false,
      });
      module.components.set(DependencyOne, {
        instance: Object.create(DependencyOne.prototype),
        resolved: false,
      });
      module.components.set(DependencyTwo, {
        instance: Object.create(DependencyTwo.prototype),
        resolved: false,
      });
    });

    it('should create an instance of component with proper dependencies', () => {
      injector.loadInstance(MainComponent, module.components, module);
      const { instance } = <InstanceWrapper<MainComponent>>(
        module.components.get(MainComponent)
      );

      expect(instance.dependencyOne instanceof DependencyOne).to.be.true;
      expect(instance.dependencyTwo instanceof DependencyTwo).to.be.true;
      expect(instance instanceof MainComponent).to.be.true;
    });

    it('should set "resolved" property to true after instance initialization', () => {
      injector.loadInstance(MainComponent, module.components, module);
      const { resolved } = <InstanceWrapper<MainComponent>>(
        module.components.get(MainComponent)
      );

      expect(resolved).to.be.true;
    });

    it('should throw RuntimeException when type is not stored in collection', () => {
      expect(
        injector.loadInstance.bind(
          injector,
          'TestComponent',
          module.components,
          module,
        ),
      ).to.throw(RuntimeException);
    });
  });

  describe('loadPrototypeOfInstance', () => {
    @Component()
    class TestComponent {}

    let module: ModuleDependency;

    beforeEach(() => {
      module = {
        instance: null,
        components: new Map<any, InstanceWrapper<any>>(),
      };
      module.components.set(TestComponent, {
        instance: Object.create(TestComponent.prototype),
        resolved: false,
      });
    });

    it('should create prototype of instance', () => {
      const expectedResult = {
        instance: Object.create(TestComponent.prototype),
        resolved: false,
      };

      injector.loadPrototypeOfInstance(TestComponent, module.components);

      expect(module.components.get(TestComponent)).to.deep.equal(
        expectedResult,
      );
    });
  });
});
