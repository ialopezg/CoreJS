import 'reflect-metadata';

import { Controller } from '../common/interfaces';
import { ProxyClientFactory } from './client/proxy-client.factory';
import { ListenersMetadataExplorer } from './explorer';
import { Server } from './server';

/**
 * Listeners Controller.
 */
export class ListenersController {
  private readonly explorer = new ListenersMetadataExplorer();

  /**
   * Bind client object to properties.
   *
   * @param instance Instance to be analyzed.
   */
  bindClientToProperties(instance: Controller): void {
    for (const { property, metadata } of this.explorer.scanForClientHooks(instance)) {
      Reflect.set(instance, property, ProxyClientFactory.create(metadata));
    }
  }

  /**
   * Bind message patterns from given controller to given server.
   *
   * @param instance Controller instance.
   * @param server Server instance.
   */
  bindPatternHandlers(instance: Controller, server: Server): void {
    const patternHandlers = this.explorer.explore(instance);

    patternHandlers.forEach(({ pattern, callback }) => {
      server.add(pattern, callback);
    });
  }
}
