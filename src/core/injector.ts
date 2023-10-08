import { ModulesContainer, IModuleDependencies } from './container';
import { InstanceLoader } from './loader';

/**
 * Creates all the dependency instances and injects them into the main application.
 */
export class Injector {
  private readonly loader = new InstanceLoader();

  constructor(private readonly container: ModulesContainer) {}

  /**
   * Create the instances for all registered dependencies.
   */
  public createInstances() {
    this.container.getModules().forEach((target) => {
      this.createComponentInstances(target);
      this.createControllerInstances(target);
    });
  }

  private createComponentInstances(target: IModuleDependencies) {
    target.components.forEach(
      (wrapper, component) => this.loader.loadComponentInstance(component, target.components),
    );
  }

  private createControllerInstances(target: IModuleDependencies) {
    target.controllers.forEach(
      (wrapper, controller) => this.loader.loadInstanceOfController(controller, target.controllers, target.components),
    );
  }
}
