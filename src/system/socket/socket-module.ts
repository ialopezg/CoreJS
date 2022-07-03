import 'reflect-metadata';

import { Server } from 'socket.io';

import {
  AppContainer,
  InstanceWrapper,
  ModuleDependency,
} from '../core/container';
import { SubjectsController } from './subjects-controller';
import { SocketContainer } from './sockets-container';
import { Component } from '../core/interfaces';
import { Gateway } from './interfaces';

export class SocketModule {
  private static port = 3001;
  private static IOServer: any;
  private static socketsContainer = new SocketContainer();
  private static subjectsController: SubjectsController;

  static setup(container: AppContainer): void {
    this.IOServer = new Server(this.port);
    this.subjectsController = new SubjectsController(
      this.socketsContainer,
      this.IOServer,
    );

    container.getModules().forEach(({ components }: ModuleDependency) => {
      this.scanComponentsForGateways(components);
    });
  }

  private static scanComponentsForGateways(
    components: Map<Component, InstanceWrapper<Component>>,
  ) {
    components.forEach(
      ({ instance }: InstanceWrapper<Component>, component: Component) => {
        const metadataKeys = Reflect.getMetadataKeys(component);
        if (metadataKeys.indexOf('__isGateway') >= 0) {
          this.subjectsController.hookGatewayIntoSocket(
            <Gateway>instance,
            component,
          );
        }
      },
    );
  }
}
