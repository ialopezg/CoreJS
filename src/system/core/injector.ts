import { AppContainer, InstanceWrapper, ModuleDependency } from './container';
import { Component } from './interfaces';
import { AppInstanceLoader } from './instance-loader';

/**
 * Injector of instances object.
 */
export class AppInjector {
  private readonly instanceLoader = new AppInstanceLoader();

  /**
   * Creates a new instance of AppInjector.
   *
   * @param container Dependency modules container.
   */
  constructor(private readonly container: AppContainer) {}

  /**
   * Creates all module dependency instances.
   */
  createInstancesOfDependencies(): void {
    this.container.getModules().forEach((module: ModuleDependency) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfControllers(module);
    });
  }

  /**
   * Creates all components instances in parent module.
   *
   * @param parent Parent module.
   * @private
   */
  private createInstancesOfComponents(parent: ModuleDependency) {
    parent.components.forEach(
      (_wrapper: InstanceWrapper<Component>, component: Component) => {
        this.instanceLoader.loadInstanceOfComponent(component, parent);
      },
    );
  }

  /**
   * Creates all controller instances in parent module.
   *
   * @param parent Parent module.
   * @private
   */
  private createInstancesOfControllers(parent: ModuleDependency) {
    parent.controllers.forEach((_wrapper, controller) => {
      this.instanceLoader.loadInstanceOfController(controller, parent);
    });
  }
}
