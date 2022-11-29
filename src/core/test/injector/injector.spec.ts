/* eslint-disable dot-notation */
import { expect } from 'chai';
import * as sinon from 'sinon';

import { UnknownDependenciesException } from '../../../errors/exceptions';
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

  describe('resolveSingleParam', () => {
    it('should throw "RuntimeException" when param is undefined', () => {
      expect(() => injector.resolveSingleParam(null, undefined, null)).throws(RuntimeException);
    });
  });

  describe('loadInstanceOfMiddleware', () => {
    let resolveConstructorParams: sinon.SinonSpy;

    beforeEach(() => {
      resolveConstructorParams = sinon.spy();
      injector.resolveConstructorParams = resolveConstructorParams;
    });

    it('should call "resolveConstructorParams" when instance is not resolved', () => {
      const collection = {
        get: (..._args: any) => ({
          instance: null,
        }),
        set: (..._args: any) => {},
      };

      injector.loadInstanceOfMiddleware(<any>{ name: '' }, <any>collection, null);

      expect(resolveConstructorParams.called).to.be.true;
    });

    it('should not call "resolveConstructorParams" when instance is not resolved', () => {
      const collection = {
        get: (..._args: any) => ({
          instance: {},
        }),
        set: (..._args: any) => {},
      };

      injector.loadInstanceOfMiddleware(<any>{ name: '' }, <any>collection, null);

      expect(resolveConstructorParams.called).to.be.false;
    });
  });

  describe('scanForComponent', () => {
    let scanForComponentInSubModules: sinon.SinonStub;
    const metaType = { name: 'test' };

    beforeEach(() => {
      scanForComponentInSubModules = sinon.stub();
      injector['scanForComponentInSubModules'] = scanForComponentInSubModules;
    });

    it('should return object from collection if exists', () => {
      const instance = { test: 3 };
      const collection = {
        has: () => true,
        get: () => instance,
      };

      const result = injector.scanForComponent(<any>collection, <any>metaType, null, null);

      expect(result).to.be.equal(instance);
    });

    it('should call "scanForComponentInSubModules" when object is not in collection', () => {
      scanForComponentInSubModules.returns({});
      const collection = {
        has: () => false,
      };

      injector.scanForComponent(<any>collection, <any>metaType, null, null);

      expect(scanForComponentInSubModules.called).to.be.true;
    });

    it('should throw "UnknownDependenciesException" instanceWrapper is null', () => {
      scanForComponentInSubModules.returns(null);
      const collection = {
        has: () => false,
      };

      expect(
        () => injector.scanForComponent(<any>collection, <any>metaType, null, <any>metaType),
      ).throws(UnknownDependenciesException);
    });

    it('should throw "UnknownDependenciesException" instanceWrapper is not null', () => {
      scanForComponentInSubModules.returns({});
      const collection = {
        has: () => false,
      };

      expect(
        () => injector.scanForComponent(<any>collection, <any>metaType, null, <any>metaType),
      ).not.throws(UnknownDependenciesException);
    });
  });

  describe('scanForComponentInSubModules', () => {
    let loadInstanceOfComponent: sinon.SinonStub;
    const metaType = { name: 'test' };
    const modules = {
      modules: [],
    };

    beforeEach(() => {
      loadInstanceOfComponent = sinon.stub();
      injector['loadInstanceOfComponent'] = loadInstanceOfComponent;
    });

    it('should return null when there is no submodules', () => {
      const result = injector.scanForComponentInSubModules(<any>modules, null);

      expect(result).to.be.eq(null);
    });

    it('should return null when submodules do not have appropriate component', () => {
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
      expect(injector.scanForComponentInSubModules(<any>module, <any>metaType)).to.be.eq(null);

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
      expect(injector.scanForComponentInSubModules(<any>module, <any>metaType)).to.be.eq(null);
    });

    it('should call "loadInstanceOfComponent" when component is not resolved', () => {
      const module = {
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

      injector.scanForComponentInSubModules(<any>module, <any>metaType);

      expect(loadInstanceOfComponent.called).to.be.true;
    });

    it('should not call "loadInstanceOfComponent" when component is resolved', () => {
      const module = {
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

      injector.scanForComponentInSubModules(<any>module, <any>metaType);

      expect(loadInstanceOfComponent.called).to.be.false;
    });
  });
});
