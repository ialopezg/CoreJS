import 'reflect-metadata';

import { Container, ModuleDependency } from './container';
import { AppModule, Component, Controller } from './interfaces';

export class AppDependencyScanner {
  constructor(private readonly container: Container) {}

  scan(module: AppModule) {
    this.scanForModules(module);
    this.scanModulesForDependencies();
  }

  private scanForModules(module: AppModule) {
    this.storeModule(module);

    (Reflect.getMetadata('modules', module) || []).forEach(
      (subModule: AppModule) => {
        this.scanForModules(subModule);
      },
    );
  }

  private storeModule(module: AppModule) {
    this.container.addModule(module);
  }

  private scanModulesForDependencies() {
    this.container
      .getModules()
      .forEach((_dependencies: ModuleDependency, module: AppModule) => {
        // Components
        (Reflect.getMetadata('components', module) || []).forEach(
          (component: Component) => {
            this.storeComponent(component, module);
          },
        );

        // Controllers
        (Reflect.getMetadata('controllers', module) || []).forEach(
          (controller: Controller) => {
            this.storeController(controller, module);
          },
        );
      });
  }

  private storeComponent(component: any, module: ModuleDependency) {
    this.container.addComponent(component, module);
  }

  private storeController(controller: any, module: AppModule) {
    this.container.addController(controller, module);
  }
}
