import { isUndefined } from '@ialopezg/commonjs';

import {
  IController,
  IInjectable,
  MetaType,
} from '../../common/interfaces';
import {
  RuntimeException,
  UnknownDependenciesException,
} from '../../errors';
import { MiddlewareMetaType, MiddlewareWrapper } from '../middleware';
import { InstanceWrapper } from './container';
import { Module } from './module';
import { PARAM_TYPES_METADATA } from '../../common/constants';

/**
 * Creates all the dependency instances and injects them into the main application.
 */
export class Injector {
  /**
   * Creates a new object, using an existing object as the prototype of the newly created object.
   *
   * @param {MetaType<any>} metaType Existent prototype.
   * @param {Map<string, InstanceWrapper<any>>} collection Collection that contains the prototype.
   */
  public loadPrototypeOfInstance<T>(
    metaType: MetaType<T>,
    collection: Map<string, InstanceWrapper<T>>,
  ): void {
    if (!collection || collection.get(metaType.name).resolved) {
      return;
    }

    collection.set(metaType.name, {
      ...collection.get(metaType.name),
      instance: Object.create(metaType.prototype),
    });
  }

  /**
   * Loads the instance of given component.
   *
   * @param {MetaType<IInjectable>} metaType Component object to be loaded.
   * @param {Module} parent Parent module.
   */
  public loadInstanceOfComponent(
    metaType: MetaType<IInjectable>,
    parent: Module,
  ) {
    this.loadInstance<IInjectable>(metaType, parent.components, parent);
  }

  /**
   * Loads the instance of given component.
   *
   * @param {MetaType<IController>} metaType Component object to be loaded.
   * @param {Module} parent Parent module.
   */
  public loadInstanceOfController(
    metaType: MetaType<IController>,
    parent: Module,
  ) {
    this.loadInstance<IController>(metaType, parent.controllers, parent);
  }

  /**
   * Loads the instance of given component.
   *
   * @param {IInjectable} metaType Component object to be loaded.
   * @param {Map<MiddlewareMetaType, IMiddleware>} middlewares Middlewares.
   * @param {Module} parent Parent module.
   */
  public loadInstanceOfMiddleware(
    metaType: MiddlewareMetaType,
    middlewares: Map<string, MiddlewareWrapper>,
    parent: Module,
  ) {
    const fetchedInstance = middlewares.get(metaType.name);

    if (fetchedInstance.instance) {
      return;
    }

    this.resolveConstructorParams(metaType, parent, (args: IInjectable[]) => {
      middlewares.set(metaType.name, {
        instance: new metaType(...args),
        metaType,
      });
    });
  }

  private loadInstance<T>(
    metaType: MetaType<T>,
    collection: Map<string, InstanceWrapper<T>>,
    parent: Module,
  ): void {
    const fetchedInstance = collection.get(metaType.name);
    if (isUndefined(fetchedInstance)) {
      throw new RuntimeException();
    }

    if (fetchedInstance.resolved) {
      return;
    }

    this.resolveConstructorParams<T>(metaType, parent, (args) => {
      fetchedInstance.instance = Object.assign(
        fetchedInstance.instance,
        new metaType(...args),
      );
      fetchedInstance.resolved = true;
    });
  }

  private resolveConstructorParams<T>(
    metaType: MetaType<T>,
    parent: Module,
    callback: Function,
  ): void {
    let params = Reflect.getMetadata(PARAM_TYPES_METADATA, metaType) ?? [];
    if ((<any>metaType).dependencies) {
      params = (<any>metaType).dependencies;
    }

    callback(params.map(
      (param: any) => this.resolveSingleParam(metaType, param, parent)),
    );
  }

  private resolveSingleParam<T>(
    metaType: MetaType<T>,
    param: MetaType<IInjectable>,
    parent: Module,
  ): IInjectable {
    if (isUndefined(param)) {
      throw new RuntimeException();
    }

    return this.resolveComponentInstance<T>(parent, param, metaType);
  }

  private resolveComponentInstance<T>(
    parent: Module,
    param: MetaType<IInjectable>,
    metaType: MetaType<T>,
  ): IInjectable {
    const wrapper = this.scanForComponent<T>(
      parent.components,
      param,
      parent,
      metaType,
    );

    if (!wrapper.instance) {
      this.loadInstanceOfComponent(param, parent);
    }

    return wrapper.instance;
  }

  private scanForComponent<T>(
    components: Map<string, InstanceWrapper<IInjectable>>,
    param: MetaType<IInjectable>,
    parent: Module,
    metaType: MetaType<T>,
  ): InstanceWrapper<IInjectable> {
    if (components.has(param.name)) {
      return components.get(param.name);
    }

    const wrapper = this.scanComponentInChildModules(parent, param);
    if (!wrapper) {
      throw new UnknownDependenciesException((<any>metaType).name);
    }

    return wrapper;
  }

  private scanComponentInChildModules(
    parent: Module,
    metaType: MetaType<IInjectable>,
  ): InstanceWrapper<IInjectable> {
    let wrapper: InstanceWrapper<IInjectable> = null;

    parent.modules.forEach((child) => {
      const { exports, components } = child;
      if (!exports.has(metaType.name) || !components.has(metaType.name)) {
        return;
      }

      wrapper = child.components.get(metaType.name);
      if (!wrapper.resolved) {
        this.loadInstanceOfComponent(metaType, child);
      }
    });

    return wrapper;
  }
}
