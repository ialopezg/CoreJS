import {
  ModuleMetaType,
  Controller,
  Injectable,
  MetaType,
} from '../../common/interfaces';
import { UnknownModuleException } from '../../errors/exceptions';
import { Module } from './module';


/**
 * Define a MtaType prototype for MetaType based objects.
 */
export interface InstanceWrapper<T> {
  /**
   * MetaType information.
   */
  metaType: MetaType<T>;
  /**
   * Object instance.
   */
  instance: T;
  /**
   *
   */
  resolved: boolean;
}

/**
 * Represents a Container that stores Modules and their dependencies.
 */
export class Container {
  private readonly modules = new Map<string, Module>();
  /**
   * Register an object as root Module.
   *
   @param target Module object to be registered.
   */
  addModule(target: ModuleMetaType): void {
    if (this.modules.has(target.name)) {
      return;
    }

    this.modules.set(target.name, new Module(target));
  }

  /**
   * Registers a Module as submodule in the given target module.
   *
   * @param module Module object to be registered as submodule.
   * @param target Module that will host the submodule.
   */
  addSubModule(
    module: ModuleMetaType,
    target: ModuleMetaType,
  ): void {
    if (!this.modules.has(target.name)) {
      return;
    }

    const storedModule = this.modules.get(target.name);
    const storedSubModule = this.modules.get(module.name);

    storedModule.addSubModule(storedSubModule);
  }

  /**
   * Registers a Component in the given target module.
   *
   * @param component Component object to be registered.
   * @param target Module that will host the Component.
   */
  addComponent(component: MetaType<Injectable>, target: ModuleMetaType): void {
    if (!this.modules.has(target.name)) {
      throw new UnknownModuleException();
    }

    const storedModule = this.modules.get(target.name);
    storedModule.addComponent(component);
  }

  /**
   * Registers a Controller in the given target module.
   *
   * @param controller Controller object to be registered.
   * @param target Module that will host the Controller object.
   */
  addController(controller: MetaType<Controller>, target: ModuleMetaType): void {
    if (!this.modules.has(target.name)) {
      throw new UnknownModuleException();
    }

    const storedModule = this.modules.get(target.name);
    storedModule.addController(controller);
  }

  /**
   * Registers an Injectable object as exported component in the given target module.
   *
   * @param component Injectable object to be registered.
   * @param target Module that will host the Injectable object.
   */
  addExportedComponent(
    component: MetaType<Injectable>,
    target: ModuleMetaType,
  ): void {
    if (!this.modules.has(target.name)) {
      throw new UnknownModuleException();
    }

    const storedModule = this.modules.get(target.name);
    storedModule.addExportedComponent(component);
  }

  /**
   * Clears current container.
   */
  clear() {
    this.modules.clear();
  }

  /**
   * Gets all registered modules with their dependencies.
   *
   * @returns The list of registered Modules with their dependencies.
   */
  getModules(): Map<string, Module> {
    return this.modules;
  }
}
