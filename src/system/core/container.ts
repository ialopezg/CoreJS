import { AppModule, Component, Controller } from './interfaces';

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
        instance: new target(),
        modules: [],
        components: new Map<Component, InstanceWrapper<Component>>(),
        controllers: new Map<Controller, InstanceWrapper<Controller>>(),
        exports: new Set<Component>(),
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

      storedModule.modules.push(subModule);
    }
  }

  /**
   * Registers a component in the given parent module.
   *
   * @param component Component to be registered.
   * @param parent Parent module.
   */
  addComponent(component: Component | any, parent: AppModule): void {
    if (this.modules.has(parent)) {
      const storedModule = this.modules.get(parent);
      storedModule.components.set(component, { instance: null });
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
      storedModule.controllers.set(controller, {
        instance: null,
      });
    }
  }

  /**
   * Registers an exported component in the given parent module.
   *
   * @param component Component to be exported.
   * @param parent Parent module.
   */
  addExportedComponent(component: Component, parent: AppModule): void {
    if (this.modules.has(parent)) {
      const storedModule = this.modules.get(parent);

      if (!storedModule.components.has(component)) {
        throw new Error(
          'You are trying to export component, which is not in components array also.',
        );
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

/**
 * Represents a module that contains dependencies such as Modules, Components, Controllers, etc.
 */
export interface ModuleDependency extends InstanceWrapper<AppModule> {
  /**
   * Lists of child modules.
   */
  modules: ModuleDependency[];
  /**
   * List of child components.
   */
  components?: Map<Component, InstanceWrapper<Component>>;
  /**
   * List of child controllers.
   */
  controllers?: Map<Controller, InstanceWrapper<Controller>>;
  /**
   * List of child of exported components.
   */
  exports?: Set<Component>;
}

/**
 * Represents an pobject that wrap its own instances.
 */
export interface InstanceWrapper<T> {
  /**
   * Object instance.
   */
  instance: T;
}
