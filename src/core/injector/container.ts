import { AppModule } from '../../common';
import { Controller, Injectable } from '../../common/interfaces';
import { UnknownExportException } from '../../errors';

/**
 * Represents an object that wrap its own instances.
 */
export interface InstanceWrapper<T> {
  /**
   * Object instance.
   */
  instance: T;
  resolved: boolean;
}

/**
 * Represents a module that contains dependencies such as Modules, Components, Controllers, etc.
 */
export interface ModuleDependency {
  instance: AppModule,
  /**
   * Lists of child modules.
   */
  modules?: Set<ModuleDependency>;
  /**
   * List of child components.
   */
  components?: Map<Injectable, InstanceWrapper<Injectable>>;
  /**
   * List of child controllers.
   */
  controllers?: Map<Controller, InstanceWrapper<Controller>>;
  /**
   * List of child of exported components.
   */
  exports?: Set<Injectable>;
}

/**
 * Modules and dependencies Container class.
 */
export class AppContainer {
  private readonly modules = new Map<AppModule, ModuleDependency>();

  /**
   * Register a module as root module.
   *
   @param target Module object to be registered.
   */
  addModule(target: AppModule | any): void {
    if (!this.modules.has(target)) {
      this.modules.set(target, {
        // eslint-disable-next-line new-cap
        instance: new target(),
        modules: new Set<ModuleDependency>(),
        components: new Map<Injectable, InstanceWrapper<Injectable>>(),
        controllers: new Map<Controller, InstanceWrapper<Controller>>(),
        exports: new Set<Injectable>(),
      });
    }
  }

  /**
   * Registers a module as child in the given parent module.
   *
   * @param target Module to be registered.
   * @param parent Parent module.
   */
  addSubModule(target: AppModule, parent: AppModule): void {
    if (this.modules.has(parent)) {
      const storedModule = this.modules.get(parent);
      const subModule = this.modules.get(target);

      storedModule.modules.add(subModule);
    }
  }

  /**
   * Registers a component in the given parent module.
   *
   * @param component Component to be registered.
   * @param parent Parent module.
   */
  addComponent(component: Injectable, parent: AppModule): void {
    if (this.modules.has(parent)) {
      const storedModule = this.modules.get(parent);
      storedModule.components.set(component, { instance: null, resolved: false });
    }
  }

  /**
   * Registers a controller in the given parent module.
   *
   * @param controller Controller to be registered.
   * @param parent Parent module.
   */
  addController(controller: any, parent: AppModule) {
    if (this.modules.has(parent)) {
      const storedModule = this.modules.get(parent);
      storedModule.controllers.set(controller, { instance: null, resolved: false });
    }
  }

  /**
   * Registers an exported component in the given parent module.
   *
   * @param component Component to be exported.
   * @param parent Parent module.
   */
  addExportedComponent(component: Injectable, parent: AppModule): void {
    if (this.modules.has(parent)) {
      const storedModule = this.modules.get(parent);

      if (!storedModule.components.has(component)) {
        throw new UnknownExportException();
      }

      storedModule.exports.add(component);
    }
  }

  /**
   * Gets all registered modules and its dependencies.
   *
   * @returns A list of modules with their dependencies.
   */
  getModules(): Map<AppModule, ModuleDependency> {
    return this.modules;
  }
}
