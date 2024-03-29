import 'reflect-metadata';

import { ModuleContainer, InstanceWrapper } from '../core/injector';
import { Injectable } from '../common/interfaces';
import { WebSocketsController } from './controller';
import { SocketContainer } from './container';
import { Gateway } from './interfaces';
import { SocketServerProvider } from './provider';
import { GATEWAY_METADATA } from './constants';

/**
 * Represents a module that could listen to gateway services.
 */
export class SocketModule {
  private static container = new SocketContainer();
  private static controller: WebSocketsController;

  /**
   * Configure the Socket Module for gateway services.
   *
   * @param {SocketContainer} container Container for Observable Socket Servers.
   */
  public static setup(container: ModuleContainer) {
    this.controller = new WebSocketsController(
      new SocketServerProvider(this.container),
    );

    container.getModules().forEach(
      ({ components }) => this.hookGatewaysIntoServers(components),
    );
  }

  private static hookGatewaysIntoServers(
    components: Map<string, InstanceWrapper<Injectable>>,
  ): void {
    components.forEach(({ isNotMetaType, instance, metaType }) => {
      if (!isNotMetaType) {
        return;
      }

      const keys = Reflect.getMetadataKeys(metaType);
      if (!keys.includes(GATEWAY_METADATA)) {
        return;
      }

      this.controller.hook(<Gateway>instance, metaType);
    });
  }
}
