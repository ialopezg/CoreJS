import { IModule, IComponent, IController } from './interfaces';

/**
 * Application Modules' container
 */
export class ModuleContainer {
  private readonly modules = new Map<IModule, IModuleDependencies>();

  /**
   * Register a module into the current container.
   *
   * @param {IModule} target Module to be registered.
   */
  public addModule(target: IModule): void {
    if (!this.modules.has(target)) {
      this.modules.set(target, {
        instance: new (<any>target)(),
        modules: [],
        components: new Map<IComponent, IInstanceWrapper<IComponent>>(),
        controllers: new Map<IController, IInstanceWrapper<IController>>(),
        exports: new Set<IComponent>(),
      });
    }
  }

  /**
   * Register a module in the given parent module.
   *
   * @param {IModule} child Child module.
   * @param {IModule} parent Parent module
   */
  public addChildModule(child: IModule, parent: IModule): void {
    if (this.modules.has(parent)) {
      const childModule = this.modules.get(child);

      this.modules.get(parent).modules.push(childModule);
    }
  }

  /**
   * Register a component or service to be used by a module.
   *
   * @param {IComponent} target Component to be registered.
   * @param {IModule} parent Component's owner module.
   */
  public addComponent(target: IComponent, parent: IModule): void {
    if (this.modules.has(parent)) {
      this.modules.get(parent).components.set(target, { instance: null });
    }
  }

  /**
   * Register a route to be used as an endpoint.
   *
   * @param {IController} target Route to be registered.
   * @param {IModule} parent Route's owner module.
   */
  public addController(target: IController, parent: IModule): void {
    if (this.modules.has(parent)) {
      this.modules.get(parent).controllers.set(target, { instance: null });
    }
  }

  /**
   * Marks a registered component as an exportable and shareable component.
   *
   * @param {IComponent} target Component to be exported.
   * @param {IModule} parent Parent module.
   */
  public addExportComponent(target: IComponent, parent: IModule): void {
    if (this.modules.has(parent)) {
      const parentModule = this.modules.get(parent);
      if (!parentModule.components.get(target)) {
        throw new Error(
          'You are trying to export component, which is not registered in components array.',
        );
      }

      parentModule.exports.add(target);
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
export interface IModuleDependencies extends IInstanceWrapper<IModule> {
  /**
   * Child modules.
   */
  modules: IModuleDependencies[];
  /**
   * Module's Dependency components.
   */
  components?: Map<IComponent, IInstanceWrapper<IComponent>>;
  /**
   * Module's Controller endpoints.
   */
  controllers?: Map<IController, IInstanceWrapper<IController>>;
  /**
   * Exported components.
   */
  exports?: Set<IComponent>;
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
