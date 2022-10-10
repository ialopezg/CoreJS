import 'reflect-metadata';
import { AppModule } from '../common';
import { Controller, Injectable } from '../common/interfaces';

import { AppContainer, ModuleDependency } from './injector';

/**
 * Module Dependency Scanner.
 */
export class DependencyScanner {
  constructor(private readonly container: AppContainer) {}

  /**
   * Module deeply scan for its dependencies.
   */
  scan(module: AppModule) {
    this.scanForModules(module);
    this.scanModulesForDependencies();
  }

  /**
   * Scan a module recursively for its dependencies.
   *
   * @param module Module to be scanned.
   */
  private scanForModules(module: AppModule) {
    this.storeModule(module);

    (Reflect.getMetadata('modules', module) || []).forEach(
      (subModule: AppModule) => this.scanForModules(subModule),
    );
  }

  /**
   * Register a root module.
   *
   * @param module Module to be registered.
   */
  storeModule(module: AppModule) {
    this.container.addModule(module);
  }

  /**
   * Module scanning for dependencies.
   */
  private scanModulesForDependencies() {
    const modules = this.container.getModules();

    // Modules deep scanning
    modules.forEach((_dependencies: ModuleDependency, parent: AppModule) => {
      this.reflectSubModules(parent);
      this.reflectComponents(parent);
      this.reflectControllers(parent);
      this.reflectExportedComponents(parent);
    });
  }

  private reflectSubModules(parent: AppModule): void {
    (Reflect.getMetadata('modules', parent) || []).forEach((child: AppModule) => {
      this.storeSubModule(child, parent);
    });
  }

  private reflectComponents(parent: AppModule): void {
    (Reflect.getMetadata('components', parent) || []).forEach(
      (component: any) => this.storeComponent(component, parent),
    );
  }

  private reflectControllers(parent: AppModule): void {
    (Reflect.getMetadata('controllers', parent) || []).forEach(
      (controller: Controller) => this.storeController(controller, parent),
    );
  }

  private reflectExportedComponents(parent: AppModule): void {
    (Reflect.getMetadata('exports', parent) || []).forEach(
      (component: any) => this.storeExportedComponent(component, parent),
    );
  }

  /**
   * Registered a child module on the parent.
   *
   * @param module Child module.
   * @param parent Parent module.
   */
  storeSubModule(module: AppModule, parent: AppModule): void {
    this.container.addSubModule(module, parent);
  }

  /**
   * Registered a component on the parent.
   *
   * @param component Component to be registered.
   * @param parent Parent module.
   */
  storeComponent(component: Injectable, parent: AppModule) {
    this.container.addComponent(component, parent);
  }

  /**
   * Registered a controller on the parent.
   *
   * @param controller Controller to be registered.
   * @param parent Parent module.
   */
  storeController(controller: Controller, parent: AppModule) {
    this.container.addController(controller, parent);
  }

  /**
   * Registered a component as exported on the parent.
   *
   * @param component Component to be exported.
   * @param parent Parent module.
   */
  storeExportedComponent(component: Injectable, parent: AppModule) {
    this.container.addExportedComponent(component, parent);
  }
}
