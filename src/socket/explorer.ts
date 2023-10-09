import 'reflect-metadata';

import { IGateway } from './interfaces';

/**
 * Defines an explorer object that scans for all method names in an instance.
 */
export class GatewayMetadataExplorer {
  /**
   * Scans for all method names in the given instance.
   *
   * @param {IGateway} instance Instance to be bound.
   *
   * @returns {MessageMappingProperties[]} Returns a list of MessageMappingProperty objects.
   */
  public static explore(instance: IGateway): MessageMappingProperties[] {
    return this.scanForHandlersFromPrototypes(instance, Object.getPrototypeOf(instance));
  }

  /**
   * Scans for server hooks in the given instance.
   *
   * @param {IGateway} instance Instance to be scanned.
   */
  public static* scanForServerHooks(instance: IGateway): IterableIterator<string> {
    for (const property in instance) {
      if (typeof property === 'function') {
        continue;
      }

      const isServer = Reflect.getMetadata('__isSocketServer', instance, String(property));
      if (typeof isServer !== 'undefined') {
        yield String(property);
      }
    }
  }

  private static scanForHandlersFromPrototypes(instance: IGateway, prototype: any) {
    return Object.getOwnPropertyNames(prototype)
      .filter(
        (property) => property !== 'constructor' && typeof prototype[property] === 'function',
      )
      .map((property) => this.exploreMetadata(instance, prototype, property))
      .filter((message) => message !== null);
  }

  private static exploreMetadata(instance: IGateway, prototype: any, methodName: string): MessageMappingProperties {
    const callback = prototype[methodName];
    const isMessageMapping = Reflect.getMetadata('__isMessageMapping', callback);

    if (typeof isMessageMapping === 'undefined') {
      return null;
    }

    const message = Reflect.getMetadata('message', callback);

    return {
      callback: (<Function>callback).bind(instance),
      message,
    };
  }
}

/**
 * Define a message mapping.
 */
export interface MessageMappingProperties {
  /**
   * Message.
   */
  message: string;
  /**
   * Callback function.
   */
  callback: Function;
}
