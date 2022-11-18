import { AppMode } from '../../common/enums';
import { Controller, Injectable } from '../../common/interfaces';
import { LoggerService } from '../../common';
import { getModuleInitMessage } from '../helpers';
import { AppContainer, InstanceWrapper } from './container';
import { Injector } from './injector';
import { Module } from './module';

/**
 * Represents a class that loads prototypes and instances of Injectable and Controller objects.
 */
export class InstanceLoader {
  private readonly logger = new LoggerService(InstanceLoader.name);
  private injector = new Injector();

  constructor(
    private readonly container: AppContainer,
    private mode = AppMode.RUN
  ) { }

  /**
   * Creates prototypes and instances of Injectable and Controller objects.
   */
  createInstancesOfDependencies(): void {
    const modules = this.container.getModules();
    this.createPrototypes(modules);
    this.createInstances(modules);
  }

  /**
   * Creates objects that has Injectable and Controller prototype.
   *
   * @param modules Module object that contains the prototypes to be created.
   */
  private createPrototypes(modules: Map<string, Module>): void {
    modules.forEach((module: Module) => {
      this.createPrototypesOfComponents(module);
      this.createPrototypesOfControllers(module);
    });
  }

  /**
   * Creates instances of Injectable and Controller objects.
   *
   * @param modules ModuleDependency that contains the object to be instantiated.
   */
  private createInstances(modules: Map<string, Module>): void {
    modules.forEach((module: Module, name: string) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfRoutes(module);

      if (this.mode === AppMode.RUN) {
        this.logger.log(getModuleInitMessage(name));
      }
    });
  }

  /**
   * Creates objects that has Injectable prototype.
   *
   * @param target Module object that contains the Injectable prototypes to be created.
   */
  private createPrototypesOfComponents(target: Module): void {
    target.components.forEach((wrapper: InstanceWrapper<Injectable>) => {
      this.injector.loadPrototypeOfInstance<Injectable>(wrapper.metaType, target.components);
    });
  }

  /**
   * Creates instances of Injectable objects.
   *
   * @param target Container Module.
   */
  private createInstancesOfComponents(target: Module): void {
    target.components.forEach((wrapper: InstanceWrapper<Injectable>) => {
      this.injector.loadInstanceOfComponent(wrapper.metaType, target);
    });
  }

  /**
   * Creates objects that has Controller prototype.
   *
   * @param target Module object that contains the Controller prototypes to be created.
   */
  private createPrototypesOfControllers(target: Module): void {
    target.controllers.forEach((wrapper) => {
      this.injector.loadPrototypeOfInstance<Controller>(wrapper.metaType, target.controllers);
    });
  }

  /**
   * Creates instances of Controller objects.
   *
   * @param target Container Module.
   */
  private createInstancesOfRoutes(target: Module) {
    target.controllers.forEach((wrapper: InstanceWrapper<Controller>): void => {
      this.injector.loadInstanceOfController(wrapper.metaType, target);
    });
  }
}
