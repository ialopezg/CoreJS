import { Gateway } from './interfaces';

/**
 * Defines a prototype object for a message mapping property.
 */
export interface MessageMappingProperty {
  /**
   * Property message.
   */
  message: string;
  /**
   * Callback action to be executed.
   */
  callback: Function;
}

/**
 * Defines an explorer object that scans for all method names in a instance.
 */
export class GatewayMetadataExplorer {
  /**
   * Scans for all method names in the given instance.
   *
   * @param instance Instance to be binded.
   *
   * @returns Returns a list of MessageMappingProperty objects.
   */
  static explore(instance: Gateway): MessageMappingProperty[] {
    return this.scanForHandlersFromPrototype(instance, Object.getPrototypeOf(instance));
  }

  /**
   * Scans for all method names in the given instance prototype.
   *
   * @param instance Instance to be binded.
   * @param prototype Prototype of the instance to be scanned.
   *
   * @returns Returns a list of MessageMappingProperty objects.
   */
  static scanForHandlersFromPrototype(
    instance: Gateway,
    prototype: any,
  ): MessageMappingProperty[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((method: string) => method !== 'constructor' && typeof prototype[method] === 'function')
      .map((method: string) => this.exploreMethodMetadata(instance, prototype, method))
      .filter((mapper: MessageMappingProperty) => mapper !== null);
  }

  /**
   * Scans a method name in the given instance prototype.
   *
   * @param instance Instance to be binded.
   * @param prototype Prototype of the instance to be scanned.
   * @param method Method to be analyzed.
   *
   * @returns Returns a MessageMappingProperty object.
   */
  static exploreMethodMetadata(
    instance: Gateway,
    prototype: any,
    method: string,
  ): MessageMappingProperty {
    const callback = prototype[method];
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

  /**
   * Scans for server hooks in the given instance.
   *
   * @param instance Instance to be scanned.
   */
  static * scanForServerHooks(instance: Gateway): IterableIterator<string> {
    for (const property in instance) {
      if (typeof property !== 'function') {
        continue;
      }

      const isServer = Reflect.getMetadata('__isSocketServer', instance, String(property));
      if (typeof isServer !== 'undefined') {
        yield String(property);
      }
    }
  }
}
