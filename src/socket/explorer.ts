import 'reflect-metadata';

import { isConstructor, isFunction, isUndefined } from '@ialopezg/commonjs';

import { IGateway } from './interfaces';
import {
  MESSAGE_MAPPING_METADATA,
  MESSAGE_METADATA,
  GATEWAY_SERVER_METADATA,
} from './constants';

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
  public explore(instance: IGateway): MessageMappingProperties[] {
    return this.scanForHandlersFromPrototypes(instance, Object.getPrototypeOf(instance));
  }

  /**
   * Scans for server hooks in the given instance.
   *
   * @param {IGateway} instance Instance to be scanned.
   */
  public* scanForServerHooks(
    instance: IGateway,
  ): IterableIterator<string> {
    for (const propertyKey in instance) {
      if (isFunction(propertyKey)) {
        continue;
      }

      const property = String(propertyKey);
      const isServer = Reflect.getMetadata(
        GATEWAY_SERVER_METADATA,
        instance,
        property,
      );
      if (!isUndefined(isServer)) {
        yield String(property);
      }
    }
  }

  private scanForHandlersFromPrototypes(
    target: IGateway,
    prototype: any,
  ): MessageMappingProperties[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((property) => {
        const descriptor = Object.getOwnPropertyDescriptor(
          prototype,
          property,
        );
        if (descriptor.set || descriptor.get) {
          return false;
        }

        return !isConstructor(property) && isFunction(prototype[property]);
      })
      .map((property) => this.exploreMetadata(target, prototype, property))
      .filter((message) => message !== null);
  }

  private exploreMetadata(
    target: IGateway,
    prototype: any,
    methodName: string,
  ): MessageMappingProperties {
    const callback = prototype[methodName];
    const isMessageMapping = Reflect.getMetadata(
      MESSAGE_MAPPING_METADATA,
      callback,
    );
    if (isUndefined(isMessageMapping)) {
      return null;
    }

    const message = Reflect.getMetadata(MESSAGE_METADATA, callback);

    return {
      callback: (<Function>callback).bind(target),
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
