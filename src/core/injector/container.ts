import { IController, IInjectable } from '../../common/interfaces';
import { IModule } from '../../common';
import { UnknownExportableComponentException } from '../../errors';

/**
 * Application Modules' container
 */
export class ModuleContainer {
  private readonly modules = new Map<IModule, ModuleDependencies>();

  /**
   * Register a module into the current container.
   *
   * @param {IModule} module Module to be registered.
   */
  public addModule(module: any): void {
    if (!this.modules.has(module)) {
      this.modules.set(module, {
        instance: new module(),
        modules: new Set<ModuleDependencies>(),
        components: new Map<IInjectable, InstanceWrapper<IInjectable>>(),
        controllers: new Map<IController, InstanceWrapper<IController>>(),
        exports: new Set<IInjectable>(),
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

      this.modules.get(parent).modules.add(childModule);
    }
  }

  /**
   * Register a component or service to be used by a module.
   *
   * @param {IInjectable} component Component to be registered.
   * @param {IModule} parent Parent module.
   */
  public addComponent(component: IInjectable, parent: IModule): void {
    if (this.modules.has(parent)) {
      this.modules.get(parent).components.set(component, {
        instance: null,
        resolved: false,
      });
    }
  }

  /**
   * Register a route to be used as an endpoint.
   *
   * @param {Controller} target Route to be registered.
   * @param {IModule} parent Parent module.
   */
  public addController(target: IController, parent: IModule): void {
    if (this.modules.has(parent)) {
      this.modules.get(parent).controllers.set(target, {
        instance: null,
        resolved: false,
      });
    }
  }

  /**
   * Marks a registered component as an exportable and shareable component.
   *
   * @param {IInjectable} target Component to be exported.
   * @param {IModule} parent Parent module.
   */
  public addExportedComponent(target: IInjectable, parent: IModule): void {
    if (this.modules.has(parent)) {
      const parentModule = this.modules.get(parent);
      if (!parentModule.components.get(target)) {
        throw new UnknownExportableComponentException((<any>target).name);
      }

      parentModule.exports.add(target);
    }
  }

  /**
   * Get all registered modules.
   *
   * @returns {Map<IModule, ModuleDependencies>} An array of the registered modules.
   */
  public getModules(): Map<IModule, ModuleDependencies> {
    return this.modules;
  }
}

/**
 * Represents all module dependency classes.
 */
export interface ModuleDependencies {
  /**
   * Module instance.
   */
  instance: IModule;
  /**
   * Child modules.
   */
  modules?: Set<ModuleDependencies>;
  /**
   * Components.
   */
  components?: Map<IInjectable, InstanceWrapper<IInjectable>>;
  /**
   * Controllers.
   */
  controllers?: Map<IController, InstanceWrapper<IController>>;
  /**
   * Exported components.
   */
  exports?: Set<IInjectable>;
}

/**
 * Represents an instance wrapper for components, services, or controllers.
 */
export interface InstanceWrapper<T> {
  /**
   * Instance wrapper.
   */
  instance: T;
  /**
   * Whether this instance is resolved.
   */
  resolved: boolean;
}
