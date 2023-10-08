import { IModule, IComponent, IController } from './interfaces';

/**
 * Application Modules' container
 */
export class ModulesContainer {
  private readonly modules = new Map<IModule, IModuleDependencies>();

  /**
   * Register a module into the current container.
   *
   * @param {IModule} target Module to be registered.
   */
  public addModule(target: IModule): void {
    if (!this.modules.has(target)) {
      this.modules.set(target, {
        components: new Map<IComponent, IInstanceWrapper<any>>(),
        controllers: new Map<IController, IInstanceWrapper<IController>>(),
      });
    }
  }

  /**
   * Register a component or service to be used by a module.
   *
   * @param {IComponent} component Component to be registered.
   * @param {IModule} parent Component's owner module.
   */
  public addComponent(component: IComponent, parent: IModule): void {
    if (this.modules.has(parent)) {
      this.modules.get(parent).components.set(component, { instance: null });
    }
  }

  /**
   * Register a route to be used as an endpoint.
   *
   * @param {IController} route Route to be registered.
   * @param {IModule} parent Route's owner module.
   */
  public addRoute(route: IController, parent: IModule): void {
    if (this.modules.has(parent)) {
      this.modules.get(parent).controllers.set(route, { instance: null });
    }
  }

  /**
   * Get all registered modules.
   *
   * @returns {Map<IModule, IModuleDependencies>} An array of the registered modules.
   */
  public getModules(): Map<IModule, IModuleDependencies> {
    return this.modules;
  }
}

/**
 * Represents all module dependency classes.
 */
export interface IModuleDependencies {
  /**
   * Module's Dependency components.
   */
  components?: Map<IComponent, IInstanceWrapper<IComponent>>;
  /**
   * Module's Controller endpoints.
   */
  controllers?: Map<IController, IInstanceWrapper<IController>>;
}

/**
 * Represents an instance wrapper for components, services, or controllers.
 */
export interface IInstanceWrapper<T> {
  /**
   * Instance wrapper.
   */
  instance: T;
}
