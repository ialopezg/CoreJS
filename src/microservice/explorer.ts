import 'reflect-metadata';

import { isConstructor, isFunction, isUndefined } from '../common';
import { Controller } from '../common/interfaces';
import {
  CLIENT_CONFIGURATION_METADATA,
  CLIENT_METADATA,
  MESSAGE_PATTERN_HANDLER_METADATA,
  MESSAGE_PATTERN_METADATA,
} from './constants';
import { ClientMetadata, MessagePatternMetadata } from './interfaces';

/**
 * Client properties.
 */
export interface ClientProperties {
  /**
   * Property name.
   */
  property: string;
  /**
   * Client metadata.
   */
  metadata: ClientMetadata;
}

/**
 * Pattern properties.
 */
export interface PatternProperties {
  /**
   * Message pattern metadata.
   */
  pattern: MessagePatternMetadata;
  /**
   * Associated callback action.
   */
  callback: Function;
}

/**
 * Metadata explorer scanner.
 */
export class ListenersMetadataExplorer {
  /**
   * Explorer an instance for metadata information.
   *
   * @param instance Instance to be explored.
   *
   * @returns An array containing PatternProperties instance.
   */
  explore(instance: Controller): PatternProperties[] {
    return this.scanHandlersFromPrototype(
      instance,
      Object.getPrototypeOf(instance),
    );
  }

  /**
   * Scans message handler in given instance and prototype.
   *
   * @param instance Instance to be scanned.
   * @param prototype Instance prototype.
   *
   * @returns An array containing PatternProperties instance.
   */
  scanHandlersFromPrototype(
    instance: Controller,
    prototype: any,
  ): PatternProperties[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((method) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, method);
        if (descriptor.set || descriptor.get) {
          return false;
        }

        return !isConstructor(method) && isFunction(prototype[method]);
      })
      .map((methodName) =>
        this.exploreMethodMetadata(instance, prototype, methodName),
      )
      .filter((mapper) => mapper !== null);
  }

  /**
   * Scan an object according given parameters.
   *
   * @param instance Instance to be explored.
   * @param prototype Instance prototype.
   * @param methodName Method name.
   *
   * @returns An instance of PatternProperties object.
   */
  exploreMethodMetadata(
    instance: Controller,
    prototype: any,
    methodName: string,
  ): PatternProperties {
    const callback = prototype[methodName];
    const isPattern = Reflect.getMetadata(
      MESSAGE_PATTERN_HANDLER_METADATA,
      callback,
    );

    if (isUndefined(isPattern)) {
      return null;
    }

    const pattern = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, callback);

    return {
      callback: (<Function>callback).bind(instance),
      pattern,
    };
  }

  /**
   * Scans for client hooks in given controller instance.
   *
   * @param instance Controller to be scanned.
   */
  * scanForClientHooks(instance: Controller): IterableIterator<ClientProperties> {
    for (const key in instance) {
      if (isFunction(key)) {
        continue;
      }

      const property = String(key);
      const isClient = Reflect.getMetadata(CLIENT_METADATA, instance, property);
      if (!isUndefined(isClient)) {
        const metadata = Reflect.getMetadata(CLIENT_CONFIGURATION_METADATA, instance, property);
        yield { property, metadata };
      }
    }
  }
}
