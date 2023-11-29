import 'reflect-metadata';

import { Controller, Injectable } from '../../common/interfaces';
import { ModuleContainer } from './container';
import { Injector } from './injector';
import { LoggerService } from '../../common';
import { Module } from './module';
import { getInitializedModuleMessage } from '../helpers';

/**
 * Instance Loader.
 */
export class InstanceLoader {
  private readonly logger = new LoggerService(InstanceLoader.name);
  private injector = new Injector();

  /**
   * Creates a new instance of the class InstanceLoader.
   *
   * @param {ModuleContainer} container Modules container.
   */
  constructor(private readonly container: ModuleContainer) {}

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

      this.logger.log(getInitializedModuleMessage(name));
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
    ) => this.injector.loadPrototypeOfInstance<Injectable>(
      wrapper,
      parent.components,
    ));
  }

  private createInstancesOfComponents(parent: Module): void {
    parent.components.forEach((
      wrapper,
    ) => this.injector.loadInstanceOfComponent(
      wrapper,
      parent,
    ));
  }

  private createPrototypesOfControllers(parent: Module): void {
    parent.controllers.forEach(
      (
        wrapper,
      ) => this.injector.loadPrototypeOfInstance<Controller>(
        wrapper,
        parent.controllers,
      ));
  }

  private createInstancesOfControllers(parent: Module): void {
    parent.controllers.forEach(
      (
        wrapper,
      ) => this.injector.loadInstanceOfController(
        wrapper,
        parent,
      ));
  }
}
