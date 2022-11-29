import { isConstructor, isFunction, isUndefined } from '../common';
import { MESSAGE_MAPPING_METADATA, MESSAGE_METADATA, GATEWAY_SERVER_METADATA } from './constants';
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
 * Defines an explorer object that scans for all method names in an instance.
 */
export class GatewayMetadataExplorer {
  /**
   * Scans for all method names in the given instance.
   *
   * @param instance Instance to be bound.
   *
   * @returns Returns a list of MessageMappingProperty objects.
   */
  explore(instance: Gateway): MessageMappingProperty[] {
    return this.scanForHandlersFromPrototype(instance, Object.getPrototypeOf(instance));
  }

  /**
   * Scans for all method names in the given instance prototype.
   *
   * @param instance Instance to be bound.
   * @param prototype Prototype of the instance to be scanned.
   *
   * @returns Returns a list of MessageMappingProperty objects.
   */
  scanForHandlersFromPrototype(
    instance: Gateway,
    prototype: any,
  ): MessageMappingProperty[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((method) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, method);
        if (descriptor.set || descriptor.get) {
          return false;
        }
        return !isConstructor(method) && isFunction(prototype[method]);
      })
      .map((method: string) => this.exploreMethodMetadata(instance, prototype, method))
      .filter((metadata) => metadata !== null);
  }

  /**
   * Scans a method name in the given instance prototype.
   *
   * @param instance Instance to be bound.
   * @param prototype Prototype of the instance to be scanned.
   * @param method Method to be analyzed.
   *
   * @returns Returns a MessageMappingProperty object.
   */
  exploreMethodMetadata(
    instance: Gateway,
    prototype: any,
    method: string,
  ): MessageMappingProperty {
    const callback = prototype[method];
    const isMessageMapping = Reflect.getMetadata(MESSAGE_MAPPING_METADATA, callback);

    if (isUndefined(isMessageMapping)) {
      return null;
    }

    const message = Reflect.getMetadata(MESSAGE_METADATA, callback);

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
  * scanForServerHooks(instance: Gateway): IterableIterator<string> {
    for (const propertyKey in instance) {
      if (isFunction(propertyKey)) {
        continue;
      }

      const property = String(propertyKey);
      const isServer = Reflect.getMetadata(GATEWAY_SERVER_METADATA, instance, String(propertyKey));
      if (isUndefined(isServer)) {
        continue;
      }

      yield property;
    }
  }
}
