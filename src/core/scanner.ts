import 'reflect-metadata';

import { ModuleContainer } from './container';
import { IModule, IComponent, IController } from './interfaces';

/**
 * Module Dependencies Scanner.
 */
export class DependencyScanner {
  /**
   * Creates a new instance of Scanner class.
   *
   * @param {ModuleContainer} container Container for modules.
   */
  constructor(private readonly container: ModuleContainer) {}

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
    this.container.getModules().forEach((_, parent) => {
      (Reflect.getMetadata('modules', parent) || [])
        .forEach((target) => this.registerChildModule(target, parent));

      (Reflect.getMetadata('components', parent) || [])
        .forEach((target) => this.registerComponent(target, parent));

      (Reflect.getMetadata('controllers', parent) || [])
        .forEach((target) => this.registerController(target, parent));

      (Reflect.getMetadata('exports', parent) || [])
        .forEach((target) => this.registerExportComponent(target, parent));
    });
  }

  private registerChildModule(target: IModule, parent: IModule) {
    this.container.addChildModule(target, parent);
  }

  private registerComponent(component: IComponent, parent: IModule) {
    this.container.addComponent(component, parent);
  }

  private registerController(route: IController, parent: IModule) {
    this.container.addController(route, parent);
  }

  private registerExportComponent(target: IComponent, parent: IModule) {
    this.container.addExportComponent(target, parent);
  }
}
