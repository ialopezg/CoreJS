import 'reflect-metadata';

import { ModulesContainer } from './container';
import { IModule, IComponent, IController } from './interfaces';

/**
 * Module Dependencies Scanner.
 */
export class DependencyScanner {
  /**
   * Creates a new instance of Scanner class.
   *
   * @param {ModulesContainer} container Container for modules.
   */
  constructor(private readonly container: ModulesContainer) {}

  /**
   * Scan given module for dependencies (components, services, and routes).
   *
   * @param {IModule} target Module to be scanned.
   */
  public scan(target: IModule) {
    this.scanModule(target);
    this.scanDependencies();
  }

  private scanModule(target: IModule) {
    this.registerModule(target);

    (Reflect.getMetadata('modules', target) || [])
      .map((child) => this.scanModule(child));
  }

  private registerModule(target: IModule) {
    this.container.addModule(target);
  }

  private scanDependencies() {
    this.container.getModules().forEach((dependencies, parent) => {
      (Reflect.getMetadata('components', parent) || [])
        .map((component) => this.registerComponent(component, parent));

      (Reflect.getMetadata('controllers', parent) || [])
        .map((route) => this.registerController(route, parent));
    });
  }

  private registerComponent(component: IComponent, parent: IModule) {
    this.container.addComponent(component, parent);
  }

  private registerController(route: IController, parent: IModule) {
    this.container.addRoute(route, parent);
  }
}
