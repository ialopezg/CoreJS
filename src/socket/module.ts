import 'reflect-metadata';

import { Injectable } from '../common/interfaces';
import { AppContainer, InstanceWrapper } from '../core/injector';
import { Module } from '../core/injector/module';
import { GATEWAY_METADATA } from './constants';
import { SocketContainer } from './container';
import { SubjectsController } from './controller';
import { AppGateway } from './interfaces';
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
    components.forEach(({ instance, metaType }: InstanceWrapper<AppGateway>) => {
      const metadataKeys = Reflect.getMetadataKeys(metaType);

      if (metadataKeys.indexOf(GATEWAY_METADATA) < 0) {
        return;
      }

      this.controller.hookGatewayIntoServer(<AppGateway>instance, metaType);
    });
  }
}
