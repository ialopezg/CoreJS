import 'reflect-metadata';

import { Server } from 'socket.io';

import { ModulesContainer, IInstanceWrapper } from '../core/container';
import { IComponent } from '../core/interfaces';
import { SubjectsController } from './controller';
import { SocketsContainer } from './container';
import { IGateway } from './interfaces';

/**
 * Represents a module that could listen gateway services.
 */
export class SocketModule {
  private static port = 80;
  private static container = new SocketsContainer();
  private static server: Server;
  private static controller: SubjectsController;

  /**
   * Configure the Socket Module for gateway services.
   *
   * @param {SocketsContainer} container Container for Observable Socket Servers.
   */
  public static setup(container: ModulesContainer): void {
    this.server = new Server().listen(this.port);
    this.controller = new SubjectsController(this.container, this.server);

    container.getModules().forEach(
      ({ components }) => this.scan(components),
    );
  }

  private static scan(
    components: Map<IComponent, IInstanceWrapper<IComponent>>,
  ): void {
    components.forEach(({ instance }, component) => {
      const keys = Reflect.getMetadataKeys(component);

      if (keys.includes('__isGateway')) {
        this.controller.hook(<IGateway>instance, component);
      }
    });
  }
}
