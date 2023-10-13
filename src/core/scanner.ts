import 'reflect-metadata';

import { ModuleContainer } from './injector';
import {
  IController,
  IInjectable,
  ModuleMetaType,
  MetaType,
} from '../common/interfaces';
import { MODULE_METADATA } from '../common/constants';

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
  public scan(target: ModuleMetaType) {
    this.scanModule(target);
    this.scanDependencies();
  }

  private scanModule(target: ModuleMetaType) {
    this.registerModule(target);

    this.getMetadata(target, MODULE_METADATA.MODULES)
      .forEach((child: any) => this.scanModule(child));
  }

  private registerModule(module: ModuleMetaType) {
    this.container.addModule(module);
  }

  private scanDependencies() {
    this.container.getModules().forEach(
      ({ metaType }) => {
        this.reflectChildModules(metaType);
        this.reflectComponents(metaType);
        this.reflectControllers(metaType);
        this.reflectExportedComponents(metaType);
      },
    );
  }

  private reflectChildModules(parent: ModuleMetaType): void {
    this.getMetadata(parent, MODULE_METADATA.MODULES)
      .forEach((child: any) => this.registerChildModule(child, parent));
  }

  private reflectComponents(parent: ModuleMetaType): void {
    this.getMetadata(parent, MODULE_METADATA.COMPONENTS)
      .forEach((component: any) => this.registerComponent(component, parent));
  }

  private reflectControllers(parent: ModuleMetaType): void {
    this.getMetadata(parent, MODULE_METADATA.CONTROLLERS)
      .forEach((controller: any) => this.registerController(controller, parent));
  }

  reflectExportedComponents(parent: ModuleMetaType): void {
    this.getMetadata(parent, MODULE_METADATA.EXPORTS)
      .forEach((component: any) => this.registerExportedComponent(component, parent));
  }

  /**
   * Registered a child module on given parent module.
   *
   * @param {ModuleMetaType} child Child module.
   * @param {ModuleMetaType} parent Parent module.
   */
  private registerChildModule(child: ModuleMetaType, parent: ModuleMetaType): void {
    this.container.addChildModule(child, parent);
  }

  /**
   * Register a component.
   *
   * @param {MetaType<IInjectable>} target Component to be registered.
   * @param {ModuleMetaType} parent Parent module.
   */
  registerComponent(target: MetaType<IInjectable>, parent: ModuleMetaType): void {
    this.container.addComponent(target, parent);
  }

  /**
   * Registered a controller on the parent.
   *
   * @param {MetaType<IController>} target Controller to be registered.
   * @param {ModuleMetaType} parent Parent module.
   */
  registerController(target: MetaType<IController>, parent: ModuleMetaType) {
    this.container.addController(target, parent);
  }

  /**
   * Register a component as an exported component.
   *
   * @param {MetaType<IInjectable>} target Component to be exported.
   * @param {ModuleMetaType} parent Parent module.
   */
  registerExportedComponent(target: MetaType<IInjectable>, parent: ModuleMetaType) {
    this.container.addExportedComponent(target, parent);
  }

  private getMetadata(target: ModuleMetaType, metadataKey: string): any {
    return Reflect.getMetadata(metadataKey, target) ?? [];
  }
}
