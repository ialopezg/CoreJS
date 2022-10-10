import { AppContainer, InstanceWrapper, ModuleDependency } from './container';
import { AppModule, Controller, Injectable } from '../../common/interfaces';
import { Injector } from './injector';

/**
 * Represents a class that loads prototypes and instances of Injectable and Controller objects.
 */
export class InstanceLoader {
  private injector = new Injector();

  /**
   * Creates a new instance of AppInjector.
   *
   * @param container Dependency modules container.
   */
  constructor(private readonly container: AppContainer) {}

  /**
   * Creates prototypes and instances of Injectable and Controller objects.
   */
  createInstancesOfDependencies(): void {
    const modules = this.container.getModules();

    this.createPrototypes(modules);
    this.createInstances(modules);
  }

  /**
   * Creates objects that has Injectable and Controller prototype.
   *
   * @param modules Module object that contains the prototypes to be created.
   */
  private createPrototypes(modules: Map<AppModule, ModuleDependency>): void {
    modules.forEach((module: ModuleDependency) => {
      this.createPrototypesOfComponents(module);
      this.createPrototypesOfControllers(module);
    });
  }

  /**
   * Creates objects that has Injectable prototype.
   *
   * @param module Module object that contains the Injectable prototypes to be created.
   */
  private createPrototypesOfComponents(module: ModuleDependency): void {
    module.components.forEach((_wrapper: InstanceWrapper<Injectable>, component: Injectable) => {
      this.injector.loadPrototypeOfInstance<Injectable>(component, module.components);
    });
  }

  /**
   * Creates objects that has Controller prototype.
   *
   * @param module Module object that contains the Controller prototypes to be created.
   */
  private createPrototypesOfControllers(module: ModuleDependency): void {
    module.controllers.forEach((_wrapper: InstanceWrapper<Controller>, controller: Controller) => {
      this.injector.loadPrototypeOfInstance<Controller>(controller, module.controllers);
    });
  }

  /**
   * Creates instances of Injectable and Controller objects.
   *
   * @param modules ModuleDependency that contains the objecto to be instanciated.
   */
  private createInstances(modules: Map<AppModule, ModuleDependency>): void {
    modules.forEach((module: ModuleDependency) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfControllers(module);
    });
  }

  /**
   * Creates instances of Injectable objects.
   *
   * @param module Container Module.
   */
  private createInstancesOfComponents(module: ModuleDependency): void {
    module.components.forEach((_wrapper: InstanceWrapper<Injectable>, component: Injectable) => {
      this.injector.loadInstanceOfComponent(component, module);
    });
  }

  /**
   * Creates instances of Controller objects.
   *
   * @param module Container Module.
   */
  private createInstancesOfControllers(module: ModuleDependency): void {
    module.controllers.forEach((_wrapper: InstanceWrapper<Injectable>, controller: Controller) => {
      this.injector.loadInstanceOfController(controller, module);
    });
  }
}
