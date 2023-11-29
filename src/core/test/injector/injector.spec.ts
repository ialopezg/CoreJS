import { expect } from 'chai';
import * as sinon from 'sinon';

import { Component } from '../../../common';
import { RuntimeException, UnknownDependenciesException } from '../../../errors';
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
    let mainTest: any;
    let dependencyOne: any;
    let dependencyTwo: any;

    beforeEach(() => {
      moduleDeps = new Module(DependencyTwo);
      mainTest = {
        name: 'MainTest',
        metaType: MainTest,
        instance: Object.create(MainTest.prototype),
        resolved: false,
      };
      dependencyOne = {
        name: 'DependencyOne',
        metaType: DependencyOne,
        instance: Object.create(DependencyOne.prototype),
        resolved: false,
      };
      dependencyTwo = {
        name: 'DependencyTwo',
        metaType: DependencyTwo,
        instance: Object.create(DependencyTwo.prototype),
        resolved: false,
      };
      moduleDeps.components.set('MainTest', mainTest);
      moduleDeps.components.set('DependencyOne', dependencyOne);
      moduleDeps.components.set('DependencyTwo', dependencyTwo);
    });

    it('should create an instance of component with proper dependencies', () => {
      injector['loadInstance'](mainTest, moduleDeps.components, moduleDeps);
      const { instance } = <InstanceWrapper<MainTest>>(moduleDeps.components.get('MainTest'));

      expect(instance.depOne instanceof DependencyOne).to.be.true;
      expect(instance.depTwo instanceof DependencyTwo).to.be.true;
      expect(instance instanceof MainTest).to.be.true;
    });

    it('should set "isResolved" property to true after instance initialization', () => {
      injector['loadInstance'](mainTest, moduleDeps.components, moduleDeps);
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
    let testComponent: any;

    beforeEach(() => {
      moduleDeps = new Module(TestComponent);
      testComponent = {
        name: 'TestComponent',
        metaType: TestComponent,
        instance: Object.create(TestComponent.prototype),
        resolved: false,
      };
      moduleDeps.components.set('TestComponent', testComponent);
    });

    it('should create prototype of instance', () => {
      const expectedResult = {
        name: 'TestComponent',
        metaType: TestComponent,
        instance: Object.create(TestComponent.prototype),
        resolved: false,
      };
      injector.loadPrototypeOfInstance(testComponent, moduleDeps.components);

      expect(moduleDeps.components.get('TestComponent')).to.deep.equal(expectedResult);
    });
  });

  describe('resolveSingleParam', () => {
    it('should throw "RuntimeException" when param is undefined', () => {
      expect(() => injector['resolveSingleParam'](
        null,
        undefined,
        null,
      )).throws(RuntimeException);
    });
  });

  describe('loadInstanceOfMiddleware', () => {
    let resolveConstructorParams: sinon.SinonSpy;

    beforeEach(() => {
      resolveConstructorParams = sinon.spy();
      injector['resolveConstructorParams'] = resolveConstructorParams;
    });

    it('should call "resolveConstructorParams" when instance is not resolved', () => {
      const collection = {
        get: (..._args: any[]) => ({
          instance: null,
        }),
        set: (..._args: any[]) => {},
      };

      injector.loadInstanceOfMiddleware(<any>{ metaType: { name: '' } }, <any>collection, null);

      expect(resolveConstructorParams.called).to.be.true;
    });

    it('should not call "resolveConstructorParams" when instance is not resolved', () => {
      const collection = {
        get: (..._args: any[]) => ({
          instance: {},
        }),
        set: (..._args: any[]) => {
        },
      };

      injector.loadInstanceOfMiddleware(<any>{ metaType: { name: '' } }, <any>collection, null);

      expect(resolveConstructorParams.called).to.be.false;
    });
  });

  describe('scanForComponent', () => {
    let scanForComponentInRelatedModules: sinon.SinonStub;
    const metaType = { name: 'test', metaType: { name: 'test' } };

    beforeEach(() => {
      scanForComponentInRelatedModules = sinon.stub();
      injector['scanComponentInChildModules'] = scanForComponentInRelatedModules;
    });

    it('should return object from collection if exists', () => {
      const instance = { test: 3 };
      const collection = {
        has: () => true,
        get: () => instance,
      };
      const result = injector['scanForComponent'](
        <any>collection,
        <any>metaType.name,
        null,
        <any>metaType,
      );

      expect(result).to.be.equal(instance);
    });

    it('should call "scanForComponentInChildModules" when object is not in collection', () => {
      scanForComponentInRelatedModules.returns({});
      const collection = {
        has: () => false,
      };
      injector['scanForComponent'](<any>collection, metaType.name, null, <any>metaType);

      expect(scanForComponentInRelatedModules.called).to.be.true;
    });

    it('should throw "UnknownDependenciesException" instanceWrapper is null', () => {
      scanForComponentInRelatedModules.returns(null);
      const collection = {
        has: () => false,
      };

      expect(
        () => injector['scanForComponent'](
          <any>collection,
          metaType.name,
          null,
          <any>metaType,
        ),
      ).throws(UnknownDependenciesException);
    });

    it('should not throw "UnknownDependenciesException" instanceWrapper is not null', () => {
      scanForComponentInRelatedModules.returns({});
      const collection = {
        has: () => false,
      };

      expect(
        () => injector['scanForComponent'](
          <any>collection,
          metaType.name,
          null,
          <any>metaType,
        ),
      ).not.throws(UnknownDependenciesException);
    });
  });

  describe('scanComponentInChildModules', () => {
    let loadInstanceOfComponent: sinon.SinonSpy;
    const metaType = { name: 'test' };
    const module = {
      modules: [],
    };

    beforeEach(() => {
      loadInstanceOfComponent = sinon.spy();
      injector['loadInstanceOfComponent'] = loadInstanceOfComponent;
    });

    it('should return null when there is no child modules', () => {
      const result = injector['scanComponentInChildModules'](
        <any>module,
        null,
      );

      expect(result).to.be.eq(null);
    });

    it('should return null when related modules do not have appropriate component', () => {
      let module = {
        modules: [{
          components: {
            has: () => false,
          },
          exports: {
            has: () => true,
          },
        }],
      };
      expect(injector['scanComponentInChildModules'](
        <any>module,
        <any>metaType,
      )).to.be.eq(null);

      module = {
        modules: [{
          components: {
            has: () => true,
          },
          exports: {
            has: () => false,
          },
        }],
      };
      expect(injector['scanComponentInChildModules'](
        <any>module,
        <any>metaType,
      )).to.be.eq(null);
    });

    it('should call "loadInstanceOfComponent" when component is not resolved', () => {
      let module = {
        modules: [{
          components: {
            has: () => true,
            get: () => ({
              resolved: false,
            }),
          },
          exports: {
            has: () => true,
          },
        }],
      };
      injector['scanComponentInChildModules'](<any>module, <any>metaType);

      expect(loadInstanceOfComponent.called).to.be.true;
    });

    it('should not call "loadInstanceOfComponent" when component is resolved', () => {
      let module = {
        modules: [{
          components: {
            has: () => true,
            get: () => ({
              resolved: true,
            }),
          },
          exports: {
            has: () => true,
          },
        }],
      };
      injector['scanComponentInChildModules'](<any>module, <any>metaType);

      expect(loadInstanceOfComponent.called).to.be.false;
    });
  });
});
