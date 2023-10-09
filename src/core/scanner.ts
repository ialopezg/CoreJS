import 'reflect-metadata';

import { ModuleContainer } from './injector';
import { IModule, IController, IInjectable } from '../common/interfaces';

/**
 * Module Dependencies Scanner.
 */
export class DependencyScanner {
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
      .map((child: any) => this.scanModule(child));
  }

  private registerModule(module: IModule) {
    this.container.addModule(module);
  }

  private scanDependencies() {
    this.container.getModules().forEach(
      (_dependencies, parent) => {
        this.reflectChildModules(parent);
        this.reflectComponents(parent);
        this.reflectControllers(parent);
        this.reflectExportedComponents(parent);
      },
    );
  }

  private reflectChildModules(parent: IModule): void {
    (Reflect.getMetadata('modules', parent) || [])
      .map((child: any) => this.registerChildModule(child, parent));
  }

  private reflectComponents(parent: IModule): void {
    (Reflect.getMetadata('components', parent) || [])
      .map((component: any) => this.registerComponent(component, parent));
  }

  private reflectControllers(parent: IModule): void {
    (Reflect.getMetadata('controllers', parent) || [])
      .map((route: any) => this.registerController(route, parent));
  }

  reflectExportedComponents(parent: IModule): void {
    (Reflect.getMetadata('exports', parent) || [])
      .map((component: any) => this.registerExportedComponent(component, parent));
  }

  /**
   * Registered a child module on given parent module.
   *
   * @param {IModule} child Child module.
   * @param {IModule} parent Parent module.
   */
  private registerChildModule(child: IModule, parent: IModule): void {
    this.container.addChildModule(child, parent);
  }

  /**
   * Register a component.
   *
   * @param {IInjectable} target Component to be registered.
   * @param {IModule} parent Parent module.
   */
  registerComponent(target: IInjectable, parent: IModule): void {
    this.container.addComponent(target, parent);
  }

  /**
   * Registered a controller on the parent.
   *
   * @param {IController} target Controller to be registered.
   * @param {IModule} parent Parent module.
   */
  registerController(target: IController, parent: IModule) {
    this.container.addController(target, parent);
  }

  /**
   * Register a component as an exported component.
   *
   * @param {IInjectable} target Component to be exported.
   * @param {IModule} parent Parent module.
   */
  registerExportedComponent(target: IInjectable, parent: IModule) {
    this.container.addExportedComponent(target, parent);
  }
}
