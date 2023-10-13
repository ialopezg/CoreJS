import 'reflect-metadata';

import { IController, IInjectable } from '../../common/interfaces';
import { ModuleContainer } from './container';
import { Injector } from './injector';
import { ApplicationMode, LoggerService } from '../../common';
import { Module } from './module';
import { getInitializedModuleMessage } from '../helpers/messages.helper';

/**
 * Instance Loader.
 */
export class InstanceLoader {
  private readonly logger: LoggerService = new LoggerService(InstanceLoader.name);
  private injector: Injector = new Injector();

  /**
   * Creates a new instance of the class InstanceLoader.
   *
   * @param {ModuleContainer} container Modules container.
   * @param {ApplicationMode} mode Application execution context.
   */
  constructor(
    private readonly container: ModuleContainer,
    private readonly mode: ApplicationMode = ApplicationMode.RUN,
  ) {
  }

  /**
   * Create the instances for all registered dependencies.
   */
  public initialize(): void {
    const modules = this.container.getModules();

    this.createPrototypes(modules);
    this.createInstances(modules);
  }

  private createPrototypes(modules: Map<string, Module>): void {
    modules.forEach((module, name) => {
      this.createPrototypesOfComponents(module);
      this.createPrototypesOfControllers(module);

      if (this.mode === ApplicationMode.RUN) {
        this.logger.log(getInitializedModuleMessage(name));
      }
    });
  }

  private createInstances(modules: Map<string, Module>): void {
    modules.forEach((module) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfControllers(module);
    });
  }

  private createPrototypesOfComponents(parent: Module): void {
    parent.components.forEach((
      wrapper,
    ) => this.injector.loadPrototypeOfInstance<IInjectable>(
      wrapper.metaType,
      parent.components,
    ));
  }

  private createInstancesOfComponents(parent: Module): void {
    parent.components.forEach((
      wrapper,
    ) => this.injector.loadInstanceOfComponent(
      wrapper.metaType,
      parent,
    ));
  }

  private createPrototypesOfControllers(parent: Module): void {
    parent.controllers.forEach(
      (
        wrapper,
      ) => this.injector.loadPrototypeOfInstance<IController>(
        wrapper.metaType,
        parent.controllers,
      ));
  }

  private createInstancesOfControllers(parent: Module): void {
    parent.controllers.forEach(
      (
        wrapper,
      ) => this.injector.loadInstanceOfController(
        wrapper.metaType,
        parent,
      ));
  }
}
