/* eslint-disable new-cap */
import 'reflect-metadata';

import { RuntimeException } from '../../common';
import { Controller, Injectable } from '../../common/interfaces';
import { CircularDependencyException, UnknownDependenciesException } from '../../errors/exceptions';
import { Middleware, MiddlewareProto } from '../middleware';
import { InstanceWrapper, ModuleDependency } from './container';

/**
 * Represents an Injector object class.
 */
export class Injector {
  /**
   * Creates an object that has the specified prototype.
   *
   * @param type Object to use as a prototype.
   * @param collection Collection that contains the prototype to be created.
   */
  loadPrototypeOfInstance<T>(type: T | any, collection: Map<T, InstanceWrapper<T>>): void {
    if (!collection) {
      return;
    }

    collection.set(type, {
      ...collection.get(type),
      instance: Object.create(type.prototype),
    });
  }

  /**
   * Loads an instance of given Injectable object.
   *
   * @param component Object to be loaded.
   * @param module Container Module.
   */
  loadInstanceOfComponent(component: Injectable, module: ModuleDependency | any): void {
    this.loadInstance(component, module.components, module);
  }

  /**
   * Loads an instance of given Controller object.
   *
   * @param controller Object to be loaded.
   * @param module Container Module.
   */
  loadInstanceOfController(controller: Controller, module: ModuleDependency | any): void {
    this.loadInstance(controller, module.controllers, module);
  }

  /**
   * Loads an instance of given Middleware object.
   *
   * @param target Object to be loaded.
   * @param collection Collection that contains the object to be loaded.
   * @param module Container Module.
   */
  loadInstanceOfMiddleware(
    target: MiddlewareProto | any,
    collection: Map<MiddlewareProto, Middleware>,
    module: ModuleDependency | any,
  ): void {
    const fetchedInstance = collection.get(target);

    if (fetchedInstance === null) {
      this.resolveConstructorParams(target, module, (args: any) => {
        collection.set(target, new target(...args));
      });
    }
  }

  /**
   * Load an instance of given prototype object.
   *
   * @param target Object requesting the parameters.
   * @param collection Component collection.
   * @param module Container Module.
   */
  loadInstance(
    target: any,
    collection: Map<any, InstanceWrapper<any>>,
    module: ModuleDependency,
  ): void {
    const fetchedInstance = collection.get(target);
    if (typeof fetchedInstance === 'undefined') {
      throw new RuntimeException();
    }

    if (!fetchedInstance.resolved) {
      this.resolveConstructorParams(target, module, (args: any): void => {
        fetchedInstance.instance = Object.assign(
          fetchedInstance.instance,
          new target(...args),
        );
        fetchedInstance.resolved = true;
      });
    }
  }

  /**
   * Resolve all Injectable Component objects requested as a constructor parameter.
   *
   * @param target Component requesting the parameters.
   * @param module Container Module.
   * @param callback Actions to be executed after resolve the Injectable Component objects.
   */
  private resolveConstructorParams(
    target: any,
    module: ModuleDependency,
    callback: (args: any) => void,
  ): void {
    let params = Reflect.getMetadata('design:paramtypes', target) || [];

    if ((<any>target).dependencies) {
      params = (<any>target).dependencies;
    }
    const args = params.map((param: any) => {
      return this.resolveSingleParam(target, param, module);
    });

    callback(args);
  }

  /**
   * Resolve for a single Injectable Component object requested as a constructor parameter.
   *
   * @param target Component requesting the parameter Component.
   * @param param Component to be looked up.
   * @param module Container Module.
   * @returns
   */
  private resolveSingleParam(
    target: Injector | any,
    param: any,
    module: ModuleDependency,
  ): Injectable {
    if (typeof param === 'undefined') {
      throw new CircularDependencyException(target);
    }

    return this.resolveComponentInstance(module, param, target);
  }

  /**
   * Resolve an Injectable Component object.
   *
   * @param module Container Module.
   * @param param Component to be looked up.
   * @param target Component requesting the parameter Component.
   * @returns The instance of the Component requested.
   */
  private resolveComponentInstance(
    module: ModuleDependency,
    param: any,
    target: Injectable,
  ): Injectable {
    const { components } = module;
    const instanceWrapper = this.scanForComponent(components, param, module, target);

    if (instanceWrapper.instance === null) {
      this.loadInstanceOfComponent(param, module);
    }

    return instanceWrapper.instance;
  }

  /**
   * Scan for a Component (Injectable) object.
   *
   * @param components
   * @param param Component to be looked up.
   * @param module Container Module.
   * @param target Component requesting the parameter Component.
   * @returns The InstanceWrapper of the Component requested.
   */
  private scanForComponent(
    components: Map<Injectable, InstanceWrapper<Injectable>>,
    param: Injectable,
    module: ModuleDependency,
    target: Injectable | any,
  ): InstanceWrapper<Injectable> {
    if (!components.has(param)) {
      const instanceWrapper = this.scanForComponentInSubModules(module, param);

      if (instanceWrapper === null) {
        throw new UnknownDependenciesException(target.name);
      }

      return instanceWrapper;
    }

    return components.get(param);
  }

  /**
   * Scan for a Component (Injectable) object in submodules.
   *
   * @param module Container Module.
   * @param target Component to be looked up.
   * @returns The instance of the Component requested.
   */
  private scanForComponentInSubModules(
    module: ModuleDependency,
    target: Injectable,
  ): InstanceWrapper<Injectable> {
    const { modules } = module;
    let component = null;

    modules.forEach((subModule: ModuleDependency) => {
      const { components, exports } = subModule;

      if (!exports.has(target) || !components.has(target)) {
        return;
      }

      component = components.get(target);
      if (!component.resolved) {
        this.loadInstanceOfComponent(target, subModule);
      }
    });

    return component;
  }
}
