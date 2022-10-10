import 'reflect-metadata';

import { Injectable } from '../common/interfaces';
import { AppContainer, InstanceWrapper, ModuleDependency } from '../core/injector';
import { SocketContainer } from './container';
import { SubjectsController } from './controller';
import { Gateway } from './interfaces';
import { SocketServerProvider } from './provider';

/**
 * Socket module.
 */
export class SocketModule {
  private static readonly container = new SocketContainer();
  private static controller: SubjectsController;

  /**
   * Setup a Socket module with given module container.
   *
   * @param container Modules container.
   */
  static setup(container: AppContainer) {
    this.controller = new SubjectsController(
      new SocketServerProvider(this.container),
    );

    container.getModules().forEach(({ components }: ModuleDependency) => {
      this.hookGatewayIntoServers(components);
    });
  }

  /**
   * Hook a Gateway instance into Server objects.
   *
   * @param components Component list to be analyzed.
   */
  private static hookGatewayIntoServers(
    components: Map<Injectable, InstanceWrapper<Injectable>>,
  ): void {
    components.forEach(({ instance }: InstanceWrapper<Gateway>, component: Injectable) => {
      const metadataKeys = Reflect.getMetadataKeys(component);

      if (metadataKeys.indexOf('__isGateway') < 0) {
        return;
      }

      this.controller.hookGatewayIntoServer(<Gateway>instance, component);
    });
  }
}
