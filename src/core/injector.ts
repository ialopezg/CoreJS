import { ModuleContainer, IModuleDependencies } from './container';
import { InstanceLoader } from './loader';

/**
 * Creates all the dependency instances and injects them into the main application.
 */
export class Injector {
  private readonly loader = new InstanceLoader();

  /**
   * Creates a new instance of Injector class.
   *
   * @param {ModuleContainer} container Modules container.
   */
  constructor(private readonly container: ModuleContainer) {}

  /**
   * Create the instances for all registered dependencies.
   */
  public initialize() {
    this.container
      .getModules()
      .forEach((target) => {
          this.initializeComponents(target);
          this.initializeControllers(target);
        },
      );
  }

  private initializeComponents(parent: IModuleDependencies) {
    parent.components.forEach(
      (_wrapper, target) => {
        this.loader.loadComponentInstance(target, parent)
      },
    );
  }

  private initializeControllers(parent: IModuleDependencies) {
    parent.controllers.forEach(
      (_wrapper, target) => {
        this.loader.loadInstanceOfController(target, parent)
      },
    );
  }
}
