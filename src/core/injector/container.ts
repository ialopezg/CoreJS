import {
  Controller,
  Injectable,
  MetaType,
  ModuleMetaType,
} from '../../common/interfaces';
import { UnknownModuleException } from '../../errors';
import { Module } from './module';

/**
 * Application Modules' container
 */
export class ModuleContainer {
  private readonly modules: Map<string, Module> = new Map<string, Module>();

  /**
   * Register a module into the current container.
   *
   * @param {ModuleMetaType} target Module to be registered.
   */
  public addModule(target: ModuleMetaType): void {
    if (this.modules.has(target.name)) {
      return;
    }

    this.modules.set(target.name, new Module(target));
  }

  /**
   * Register a module in the given parent module.
   *
   * @param {ModuleMetaType} child Child module.
   * @param {ModuleMetaType} parent Parent module
   */
  public addChildModule(child: ModuleMetaType, parent: ModuleMetaType): void {
    if (!this.modules.has(parent.name)) {
      return;
    }

    const childModule = this.modules.get(child.name);
    this.modules.get(parent.name).addChildModule(childModule);
  }

  /**
   * Register a component or service to be used by a module.
   *
   * @param {MetaType<Injectable>} target Component to be registered.
   * @param {ModuleMetaType} parent Parent module.
   */
  public addComponent(target: MetaType<Injectable>, parent: ModuleMetaType): void {
    if (!this.modules.has(parent.name)) {
      throw new UnknownModuleException(parent.name);
    }

    this.modules.get(parent.name).addComponent(target);
  }

  /**
   * Register a route to be used as an endpoint.
   *
   * @param {MetaType<Controller>} target Route to be registered.
   * @param {ModuleMetaType} parent Parent module.
   */
  public addController(target: MetaType<Controller>, parent: ModuleMetaType): void {
    if (!this.modules.has(parent.name)) {
      throw new UnknownModuleException(parent.name);
    }

    this.modules.get(parent.name).addController(target);
  }

  /**
   * Marks a registered component as an exportable and shareable component.
   *
   * @param {MetaType<Injectable>} target Component to be exported.
   * @param {ModuleMetaType} parent Parent module.
   */
  public addExportedComponent(target: MetaType<Injectable>, parent: ModuleMetaType): void {
    if (!this.modules.has(parent.name)) {
      throw new UnknownModuleException(parent.name);
    }

    this.modules.get(parent.name).addExportedComponent(target);
  }

  /**
   * Clear modules container.
   */
  public clear(): void {
    this.modules.clear();
  }

  /**
   * Get all registered modules.
   *
   * @returns {Map<string, Module>} An array of the registered modules.
   */
  public getModules(): Map<string, Module> {
    return this.modules;
  }
}

/**
 * Represents an instance wrapper for components, services, or controllers.
 */
export interface InstanceWrapper<T> {
  /**
   * Instance name.
   */
  name: any;
  /**
   * Instance meta-type information.
   */
  metaType: MetaType<T>;
  /**
   * Instance wrapper.
   */
  instance: T;
  /**
   * Whether this instance is resolved.
   */
  resolved: boolean;
  /**
   * Dependencies to be injected.
   */
  inject?: MetaType<any>[];
  /**
   * Whether the current instance is a meta-type object.
   */
  isNotMetaType?: boolean;
}
