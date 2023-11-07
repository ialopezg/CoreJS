import 'reflect-metadata';

import { IController } from '../common/interfaces';
import { ListenerMetadataExplorer } from './explorer';
import { ClientProxyFactory } from './client/factory';
import { Server } from './server';

/**
 * Represents a controller that hosts the message pattern listeners.
 */
export class ListenerController {
  private readonly explorer = new ListenerMetadataExplorer();

  /**
   * Binds the message pattern handlers.
   *
   * @param {IController} target Target controller.
   * @param {Server} server Server instance.
   */
  public bindHandlers(target: IController, server: Server) {
    const handlers = this.explorer.explore(target);

    handlers.forEach(({ pattern, callback }) => {
      server.add(pattern, callback);
    });
  }

  /**
   * Binds client instances on target controller.
   *
   * @param {IController} target Target controller.
   */
  public bindClients(target: IController) {
    for (const {
      property,
      metadata,
    } of this.explorer.scanForClientHooks(target)) {
      Reflect.set(target, property, ClientProxyFactory.create(metadata));
    }
  }
}
