import 'reflect-metadata';

import { IController, IInjectable, IModule } from '../../common/interfaces';
import { ModuleDependencies, ModuleContainer } from './container';
import { Injector } from './injector';

/**
 * Dependencies Instance Loader.
 */
export class InstanceLoader {
  private injector = new Injector();

  /**
   * Creates a new instance of the class InstanceLoader.
   *
   * @param {ModuleContainer} container Modules container.
   */
  constructor(private readonly container: ModuleContainer) {}

  /**
   * Create the instances for all registered dependencies.
   */
  public initialize(): void {
    const modules = this.container.getModules();

    this.createPrototypes(modules);
    this.createInstances(modules);
  }

  private createPrototypes(modules: Map<IModule, ModuleDependencies>): void {
    modules.forEach((module) => {
      this.createPrototypesOfComponents(module);
      this.createPrototypesOfControllers(module);
    });
  }

  private createInstances(modules: Map<IModule, ModuleDependencies>): void {
    modules.forEach((module) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfControllers(module);
    });
  }

  private createPrototypesOfComponents(module: ModuleDependencies): void {
    module.components.forEach(
      (
        _wrapper,
        prototype,
      ) => this.injector.loadPrototypeOfInstance<IInjectable>(prototype, module.components),
    );
  }

  private createInstancesOfComponents(module: ModuleDependencies): void {
    module.components.forEach(
      (
        _wrapper,
        prototype,
      ) => this.injector.loadInstanceOfComponent(prototype, module),
    );
  }

  private createPrototypesOfControllers(module: ModuleDependencies): void {
    module.controllers.forEach(
      (
        _wrapper,
        prototype,
      ) => this.injector.loadPrototypeOfInstance<IController>(prototype, module.controllers),
    );
  }

  private createInstancesOfControllers(module: ModuleDependencies): void {
    module.controllers.forEach(
      (
        _wrapper,
        prototype,
      ) => this.injector.loadInstanceOfController(prototype, module),
    );
  }
}
