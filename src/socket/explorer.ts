import { isConstructor, isFunction, isUndefined } from '../common';
import { MESSAGE_MAPPING_METADATA, MESSAGE_METADATA, SOCKET_SERVER_METADATA } from './constants';
import { AppGateway } from './interfaces';

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
  static explore(instance: AppGateway): MessageMappingProperty[] {
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
    instance: AppGateway,
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
    instance: AppGateway,
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
  static *scanForServerHooks(instance: AppGateway): IterableIterator<string> {
    for (const property in instance) {
      if (isFunction(property)) {
        continue;
      }

      const isServer = Reflect.getMetadata(SOCKET_SERVER_METADATA, instance, String(property));
      if (isUndefined(isServer)) {
        yield String(property);
      }
    }
  }
}
