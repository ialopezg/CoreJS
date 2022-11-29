import { AppMode, LoggerService } from '../../common';
import { Controller, Injectable } from '../../common/interfaces';
import { getModuleInitMessage } from '../helpers';
import { Container } from './container';
import { Injector } from './injector';
import { Module } from './module';

/**
 * Represents a class that loads prototypes and instances of Injectable and Controller objects.
 */
export class InstanceLoader {
  private readonly logger = new LoggerService(InstanceLoader.name);
  private injector = new Injector();

  /**
   * Creates an object that has the specified prototype.
   *
   * @param container Module container.
   */
  constructor(private readonly container: Container) {}

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
    modules.forEach((module) => {
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
    modules.forEach((module, name) => {
      this.createInstancesOfComponents(module);
      this.createInstancesOfRoutes(module);

      this.logger.log(getModuleInitMessage(name));
    });
  }

  /**
   * Creates objects that has Injectable prototype.
   *
   * @param target Module object that contains the Injectable prototypes to be created.
   */
  private createPrototypesOfComponents(target: Module): void {
    target.components.forEach((wrapper) => {
      this.injector.loadPrototypeOfInstance<Injectable>(wrapper.metaType, target.components);
    });
  }

  /**
   * Creates instances of Injectable objects.
   *
   * @param target Container Module.
   */
  private createInstancesOfComponents(target: Module): void {
    target.components.forEach((wrapper) => {
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
    target.controllers.forEach((wrapper): void => {
      this.injector.loadInstanceOfController(wrapper.metaType, target);
    });
  }
}
