import 'reflect-metadata';

import { ModuleMetaType, Controller, Injectable, MetaType } from '../common/interfaces';
import { metadata } from '../common';
import { AppContainer } from './injector';

/**
 * Defines an object that scans deeply modules and its related dependencies.
 */
export class DependencyScanner {
  /**
   * Creates a new instance for the class DependenciesScanner.
   * @param container Module container.
   */
  constructor(private readonly container: AppContainer) { }

  /**
   * Scans a base module for its dependencies.
   *
   * @param target Module base to be scanned.
   */
  scan(target: ModuleMetaType): void {
    this.scanForModules(target);
    this.scanModulesForDependencies();
  }

  /**
   * Scan a module base for its submodules recursively.
   *
   * @param module Module to be scanned.
   */
  private scanForModules(module: ModuleMetaType): void {
    this.storeModule(module);

    const subModules = this.reflectMetadata(module, metadata.MODULES);
    subModules.map((subModule: any) => this.scanForModules(subModule));
  }

  /**
   * Stores given module into the modules' container.
   *
   * @param module Module to be stored.
   */
  private storeModule(module: ModuleMetaType) {
    this.container.addModule(module);
  }

  /**
   * Scans deeply all modules for each dependencies.
   */
  private scanModulesForDependencies() {
    const modules = this.container.getModules();

    modules.forEach(({ metaType }) => {
      this.reflectRelatedModules(metaType);
      this.reflectComponents(metaType);
      this.reflectControllers(metaType);
      this.reflectExports(metaType);
    });
  }

  /**
   * Scans a module for its submodules dependencies.
   *
   * @param target Module to be scanned.
   */
  private reflectRelatedModules(target: ModuleMetaType) {
    this.reflectMetadata(target, metadata.MODULES).forEach((module) => this.storeRelatedModule(module, target));
  }

  /**
   * Scans a module for its components dependencies.
   *
   * @param target Module to be scanned.
   */
  private reflectComponents(target: ModuleMetaType) {
    this.reflectMetadata(target, metadata.COMPONENTS)
      .forEach((component: any) => this.storeComponent(component, target));
  }

  /**
   * Scans a module for its controllers dependencies.
   *
   * @param target Module to be scanned.
   */
  private reflectControllers(target: ModuleMetaType) {
    this.reflectMetadata(target, metadata.CONTROLLERS)
      .forEach((controller: any) => this.storeController(controller, target));
  }

  /**
   * Scans a module for its exported component dependencies.
   *
   * @param target Module to be scanned.
   */
  private reflectExports(target: ModuleMetaType) {
    this.reflectMetadata(target, metadata.EXPORTS)
      .forEach((component: any) => this.storeExportedComponent(component, target));
  }

  /**
   * Stores given module into the submodules collection of given target module.
   *
   * @param module Module to be stored as submodule.
   * @param target Target module.
   */
  private storeRelatedModule(module: ModuleMetaType, target: ModuleMetaType) {
    this.container.addSubModule(module, target);
  }

  /**
   * Stores given component into the components collection of given target module.
   *
   * @param component Component to be stored as submodule.
   * @param target Target module.
   */
  private storeComponent(component: MetaType<Injectable>, target: ModuleMetaType) {
    this.container.addComponent(component, target);
  }

  /**
   * Stores given component into the components collection of given target module.
   *
   * @param component Component to be stored as submodule.
   * @param target Target module.
   */
  storeExportedComponent(component: MetaType<Injectable>, target: ModuleMetaType) {
    this.container.addExportedComponent(component, target);
  }

  /**
   * Stores given controller into the controllers collection of given target module.
   *
   * @param controller Component to be stored as submodule.
   * @param target Target module.
   */
  private storeController(controller: MetaType<Controller>, target: ModuleMetaType) {
    this.container.addController(controller, target);
  }

  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   *
   * @param target The target object on which the metadata is defined.
   * @param metadataKey Metadata key.
   *
   * @returns The metadata value for the metadata key if found; otherwise, an empty array.
   */
  private reflectMetadata(target: ModuleMetaType, metadataKey: string): any[] {
    return Reflect.getMetadata(metadataKey, target) || [];
  }
}
