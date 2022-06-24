import { Container, InstanceWrapper, ModuleDependency } from './container';
import { Component } from './interfaces';
import { AppInstanceLoader } from './instance-loader';

export class AppInjector {
  private readonly instanceLoader = new AppInstanceLoader();

  constructor(private readonly container: Container) {}

  createInstancesOfDependencies(): void {
    this.container.getModules().forEach((module: ModuleDependency) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfControllers(module);
    });
  }

  private createInstancesOfComponents(module: ModuleDependency) {
    module.components.forEach(
      (_wrapper: InstanceWrapper<Component>, component: Component) => {
        this.instanceLoader.loadInstanceOfComponent(
          component,
          module.components,
        );
      },
    );
  }

  private createInstancesOfControllers(module: ModuleDependency) {
    module.controllers.forEach((_wrapper, controller) => {
      this.instanceLoader.loadInstanceOfController(
        controller,
        module.controllers,
        module.components,
      );
    });
  }
}
