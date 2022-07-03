import 'reflect-metadata';

import { AppContainer, ModuleDependency } from './container';
import { AppModule, Component, Controller } from './interfaces';

/**
 * Module Dependency Scanner.
 */
export class AppDependencyScanner {
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
      (subModule: AppModule) => {
        this.scanForModules(subModule);
      },
    );
  }

  /**
   * Register a root module.
   *
   * @param module Module to be registered.
   */
  private storeModule(module: AppModule) {
    this.container.addModule(module);
  }

  /**
   * Module scanning for dependencies.
   */
  private scanModulesForDependencies() {
    // Modules deep scanning
    this.container
      .getModules()
      .forEach((_dependencies: ModuleDependency, parent: AppModule) => {
        // Submodules
        (Reflect.getMetadata('modules', parent) || []).forEach((child: any) => {
          this.storeSubModule(child, parent);
        });

        // Components
        (Reflect.getMetadata('components', parent) || []).forEach(
          (component: any) => {
            this.storeComponent(component, parent);
          },
        );

        // Controllers
        (Reflect.getMetadata('controllers', parent) || []).forEach(
          (controller: Controller) => {
            this.storeController(controller, parent);
          },
        );

        // Exported Components
        (Reflect.getMetadata('exports', parent) || []).forEach(
          (component: any) => {
            this.storeExportedComponent(component, parent);
          },
        );
      });
  }

  /**
   * Registered a child module on the parent.
   *
   * @param module Child module.
   * @param parent Parent module.
   */
  private storeSubModule(module: any, parent: AppModule): void {
    this.container.addSubModule(module, parent);
  }

  /**
   * Registered a component on the parent.
   *
   * @param component Component to be registered.
   * @param parent Parent module.
   */
  private storeComponent(component: any, parent: AppModule) {
    this.container.addComponent(component, parent);
  }

  /**
   * Registered a controller on the parent.
   *
   * @param controller Controller to be registered.
   * @param parent Parent module.
   */
  private storeController(controller: any, parent: AppModule) {
    this.container.addController(controller, parent);
  }

  /**
   * Registered a component as exported on the parent.
   *
   * @param component Component to be exported.
   * @param parent Parent module.
   */
  private storeExportedComponent(component: any, parent: AppModule) {
    this.container.addExportedComponent(component, parent);
  }
}
