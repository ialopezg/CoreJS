import 'reflect-metadata';

import { Injectable } from '../common/interfaces';
import { Container, InstanceWrapper } from '../core/injector';
import { Module } from '../core/injector/module';
import { GATEWAY_METADATA } from './constants';
import { SocketsContainer } from './sockets.container';
import { WebSocketsController } from './websockets.controller';
import { Gateway } from './interfaces';
import { SocketServerProvider } from './socket-server.provider';

/**
 * Socket module.
 */
export class SocketModule {
  private static readonly container = new SocketsContainer();
  private static controller: WebSocketsController;

  /**
   * Setup a Socket module with given module container.
   *
   * @param container Modules container.
   */
  static setup(container: Container) {
    this.controller = new WebSocketsController(new SocketServerProvider(this.container));

    container.getModules().forEach(({ components }: Module) => {
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
    components.forEach(({
      instance,
      metaType,
    }: InstanceWrapper<Gateway>) => {
      const metadataKeys = Reflect.getMetadataKeys(metaType);

      if (metadataKeys.indexOf(GATEWAY_METADATA) < 0) {
        return;
      }

      this.controller.hookGatewayIntoServer(<Gateway>instance, metaType);
    });
  }
}
