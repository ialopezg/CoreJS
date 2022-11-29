import 'reflect-metadata';

import { isUndefined, PARAM_TYPES_METADATA, RuntimeException } from '../../common';
import { Controller, Injectable, MetaType } from '../../common/interfaces';
import { UnknownDependenciesException } from '../../errors/exceptions';
import { MiddlewareMetaType } from '../middleware/interfaces';
import { MiddlewareWrapper } from '../middleware/container';
import { InstanceWrapper } from './container';
import { Module } from './module';

/**
 * Represents an Injector object class.
 */
export class Injector {
  /**
   * Creates an object that has the specified prototype.
   *
   * @param instance Object to use as a prototype.
   * @param collection Collection that contains the prototype to be created.
   */
  loadPrototypeOfInstance<T>(instance: MetaType<T>, collection: Map<string, InstanceWrapper<T>>): void {
    if (!collection || collection.get(instance.name).resolved) {
      return;
    }

    collection.set(instance.name, {
      ...collection.get(instance.name),
      instance: Object.create(instance.prototype),
    });
  }

  /**
   * Loads an instance of given Injectable object.
   *
   * @param component Object to be loaded.
   * @param target Container Module.
   */
  loadInstanceOfComponent(component: MetaType<Injectable>, target: Module): void {
    this.loadInstance<Injectable>(component, target.components, target);
  }

  /**
   * Loads an instance of given Controller object.
   *
   * @param controller Object to be loaded.
   * @param target Container Module.
   */
  loadInstanceOfController(controller: MetaType<Controller>, target: Module): void {
    this.loadInstance<Controller>(controller, target.controllers, target);
  }

  /**
   * Loads an instance of given Middleware object.
   *
   * @param target Object to be loaded.
   * @param prototype prototype middleware.
   * @param collection Collection that contains the object to be loaded.
   * @param target Container Module.
   */
  loadInstanceOfMiddleware(
    prototype: MiddlewareMetaType,
    collection: Map<string, MiddlewareWrapper>,
    target: Module,
  ) {
    const fetchedMiddleware = collection.get(prototype.name);
    if (fetchedMiddleware.instance !== null) {
      return;
    }

    this.resolveConstructorParams(prototype, target, (args: any) => {
      collection.set(prototype.name, {
        // eslint-disable-next-line new-cap
        instance: new prototype(...args),
        metaType: prototype,
      });
    });
  }

  /**
   * Load an instance of given prototype object.
   *
   * @param prototype Object requesting the parameters.
   * @param collection Component collection.
   * @param target Container Module.
   */
  loadInstance<T>(prototype: MetaType<T>, collection: Map<any, InstanceWrapper<any>>, target: Module): void {
    const fetchedInstance = collection.get(prototype.name);
    if (isUndefined(fetchedInstance)) {
      throw new RuntimeException();
    }

    if (fetchedInstance.resolved) {
      return;
    }

    this.resolveConstructorParams<T>(prototype, target, (args: any) => {
      fetchedInstance.instance = Object.assign(
        fetchedInstance.instance,
        // eslint-disable-next-line new-cap
        new prototype(...args),
      );
      fetchedInstance.resolved = true;
    });
  }

  /**
   * Resolve all Injectable Component objects requested as a constructor parameter.
   *
   * @param prototype Component requesting the parameters.
   * @param target Container Module.
   * @param callback Actions to be executed after resolve the Injectable Component objects.
   */
  resolveConstructorParams<T>(prototype: MetaType<T>, target: Module, callback: Function): void {
    const params = Reflect.getMetadata(PARAM_TYPES_METADATA, prototype) || [];
    const args = params.map((param: any) => this.resolveSingleParam<T>(prototype, param, target));
    callback(args);
  }

  /**
   * Resolve for a single Injectable Component object requested as a constructor parameter.
   *
   * @param prototype Component requesting the parameter Component.
   * @param param Component to be looked up.
   * @param target Container Module.
   *
   * @returns An instance of Injectable.
   */
  resolveSingleParam<T>(prototype: MetaType<T>, param: MetaType<any>, target: Module): Injectable {
    if (isUndefined(param)) {
      throw new RuntimeException();
    }

    return this.resolveComponentInstance<T>(target, param, prototype);
  }

  /**
   * Resolve an Injectable Component object.
   *
   * @param target Container Module.
   * @param param Component to be looked up.
   * @param prototype Component requesting the parameter Component.
   *
   * @returns An instance of Injectable.
   */
  resolveComponentInstance<T>(target: Module, param: MetaType<any>, prototype: MetaType<T>): Injectable {
    const components = target.components;
    const instanceWrapper = this.scanForComponent<T>(components, param, target, prototype);

    if (instanceWrapper.instance === null) {
      this.loadInstanceOfComponent(param, target);
    }

    return instanceWrapper.instance;
  }

  /**
   * Scan for a Component (Injectable) object.
   *
   * @param components Component list.
   * @param param Component to be looked up.
   * @param target Container Module.
   * @param prototype Component requesting the parameter Component.
   *
   * @returns An Instance of InstanceWrapper<Injectable>.
   */
  scanForComponent<T>(
    components: Map<string, InstanceWrapper<Injectable>>,
    param: MetaType<any>,
    target: Module,
    prototype: MetaType<T>,
  ): InstanceWrapper<Injectable> {
    if (components.has(param.name)) {
      return components.get(param.name);
    }

    const instanceWrapper = this.scanForComponentInSubModules(target, param);
    if (instanceWrapper === null) {
      throw new UnknownDependenciesException(prototype.name);
    }

    return instanceWrapper;
  }

  /**
   * Scan for a Component (Injectable) object in submodules.
   *
   * @param target Container Module.
   * @param prototype Component to be looked up.
   *
   * @returns An instance of InstanceWrapper<Injectable>.
   */
  scanForComponentInSubModules(target: Module, prototype: MetaType<any>): InstanceWrapper<Injectable> {
    const modules = target.modules || [];
    let instanceWrapper = null;

    (<Array<any>>modules).forEach((module: Module) => {
      const { components, exports } = module;

      if (!exports.has(prototype.name) || !components.has(prototype.name)) {
        return;
      }

      instanceWrapper = components.get(prototype.name);
      if (!instanceWrapper.resolved) {
        this.loadInstanceOfComponent(prototype, module);
      }
    });

    return instanceWrapper;
  }
}
