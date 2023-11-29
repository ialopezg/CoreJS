import { isFunction, isNil, isUndefined } from '@ialopezg/commonjs';

import {
  Controller,
  Injectable,
  MetaType,
} from '../../common/interfaces';
import {
  RuntimeException,
  UnknownDependenciesException,
} from '../../errors';
import { MiddlewareWrapper } from '../middleware';
import { InstanceWrapper } from './container';
import { Module } from './module';
import {
  DESIGN_PARAM_TYPES_METADATA,
  SELF_PARAM_TYPES_METADATA,
} from '../../common/constants';

/**
 * Creates all the dependency instances and injects them into the main application.
 */
export class Injector {
  /**
   * Creates a new object, using an existing object as the prototype of the newly created object.
   *
   * @param {MetaType<any>} metaType Existent prototype.
   * @param {string} name Component name.
   * @param {Map<string, InstanceWrapper<any>>} collection Collection that contains the prototype.
   */
  public loadPrototypeOfInstance<T>(
    { metaType, name }: InstanceWrapper<T>,
    collection: Map<string, InstanceWrapper<T>>,
  ): void {
    if (!collection) {
      return;
    }

    const target = collection.get(name);
    if (target.resolved || !isNil(target.inject)) {
      return;
    }

    collection.set(name, {
      ...collection.get(name),
      instance: Object.create(metaType.prototype),
    });
  }

  /**
   * Loads the instance of given component.
   *
   * @param {MetaType<Injectable>} wrapper Component object to be loaded.
   * @param {Module} parent Parent module.
   */
  public loadInstanceOfComponent(
    wrapper: InstanceWrapper<Injectable>,
    parent: Module,
  ): void {
    this.loadInstance<Injectable>(wrapper, parent.components, parent);
  }

  /**
   * Loads the instance of given component.
   *
   * @param {MetaType<Controller>} wrapper Component object to be loaded.
   * @param {Module} parent Parent module.
   */
  public loadInstanceOfController(
    wrapper: InstanceWrapper<Controller>,
    parent: Module,
  ): void {
    this.loadInstance<Controller>(wrapper, parent.controllers, parent);
  }

  /**
   * Loads the instance of given component.
   *
   * @param {Injectable} wrapper Component object to be loaded.
   * @param {Map<MiddlewareMetaType, IMiddleware>} middlewares Middlewares.
   * @param {Module} parent Parent module.
   */
  public loadInstanceOfMiddleware(
    wrapper: MiddlewareWrapper,
    middlewares: Map<string, MiddlewareWrapper>,
    parent: Module,
  ) {
    const { metaType } = wrapper;
    const fetchedInstance = middlewares.get(metaType.name);
    if (fetchedInstance.instance) {
      return;
    }

    this.resolveConstructorParams(
      <any>wrapper,
      parent,
      null,
      (args: Injectable[]) => {
        middlewares.set(metaType.name, {
          instance: new metaType(...args),
          metaType,
        });
      },
    );
  }

  private loadInstance<T>(
    wrapper: InstanceWrapper<T>,
    collection: Map<string, InstanceWrapper<T>>,
    parent: Module,
  ): void {
    const { inject, metaType, name } = wrapper;
    const instanceWrapper = collection.get(name);
    if (isUndefined(instanceWrapper)) {
      throw new RuntimeException();
    }

    if (instanceWrapper.resolved) {
      return;
    }

    this.resolveConstructorParams<T>(wrapper, parent, inject, (args: any[]) => {
      if (isNil(inject)) {
        instanceWrapper.instance = Object.assign(
          instanceWrapper.instance,
          new metaType(...args),
        );
      } else {
        instanceWrapper.instance = new instanceWrapper.metaType(...args);
      }
      instanceWrapper.resolved = true;
    });
  }

  private reflectConstructorParams<T>(metaType: MetaType<T>): any[] {
    const paramTypes = Reflect.getMetadata(DESIGN_PARAM_TYPES_METADATA, metaType) ?? [];
    const selfParams = this.reflectSelfParams<T>(metaType);

    selfParams.forEach(({ index, param }) => paramTypes[index] = param);

    return paramTypes;
  }

  private reflectSelfParams<T>(metaType: MetaType<T>): any[] {
    return Reflect.getMetadata(SELF_PARAM_TYPES_METADATA, metaType) ?? [];
  }

  private resolveConstructorParams<T>(
    wrapper: InstanceWrapper<T>,
    parent: Module,
    inject: any[],
    callback: Function,
  ): void {
    const args = isNil(inject) ? this.reflectConstructorParams(wrapper.metaType) : inject;

    callback(args.map(
      (param) => this.resolveSingleParam<T>(wrapper, param, parent),
    ));
  }

  private resolveSingleParam<T>(
    wrapper: InstanceWrapper<T>,
    param: MetaType<any> | string | symbol,
    parent: Module,
  ): Injectable {
    if (isUndefined(param)) {
      throw new RuntimeException();
    }

    return this.resolveComponentInstance<T>(
      parent,
      isFunction(param) ? (<MetaType<T>>param).name : param,
      wrapper,
    );
  }

  private resolveComponentInstance<T>(
    parent: Module,
    name: any,
    wrapper: InstanceWrapper<T>,
  ): Injectable {
    const components = parent.components;
    const instanceWrapper = this.scanForComponent<T>(
      components,
      name,
      parent,
      wrapper,
    );

    if (!instanceWrapper.instance) {
      this.loadInstanceOfComponent(name, parent);
    }

    return instanceWrapper.instance;
  }

  private scanForComponent<T>(
    components: Map<string, InstanceWrapper<any>>,
    name: any,
    parent: Module,
    { metaType }: InstanceWrapper<T>,
  ): InstanceWrapper<Injectable> {
    if (components.has(name)) {
      return components.get(name);
    }

    const wrapper = this.scanComponentInChildModules(parent, name);
    if (!wrapper) {
      throw new UnknownDependenciesException(metaType.name);
    }

    return wrapper;
  }

  private scanComponentInChildModules(
    parent: Module,
    name: any,
  ): InstanceWrapper<Injectable> {
    const childModules = parent.modules ?? [];
    let wrapper: InstanceWrapper<Injectable> = null;

    childModules.forEach((child: Module) => {
      const { exports, components } = child;
      if (!exports.has(name) || !components.has(name)) {
        return;
      }

      wrapper = child.components.get(name);
      if (!wrapper.resolved) {
        this.loadInstanceOfComponent(wrapper, child);
      }
    });

    return wrapper;
  }
}
