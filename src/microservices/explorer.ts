import 'reflect-metadata';

import { isConstructor, isFunction, isUndefined } from '@ialopezg/commonjs';

import { Controller } from '../common/interfaces';
import { ClientMetadata, PatternMetadata } from './interfaces';
import {
  CLIENT_CONFIGURATION_METADATA,
  CLIENT_METADATA,
  PATTERN_HANDLER_METADATA,
  PATTERN_METADATA,
} from './constants';

/**
 * Scan metadata for client listeners.
 */
export class ListenerMetadataExplorer {
  /**
   * Explore given target for pattern metadata.
   *
   * @param {Controller} target Target controller to be scanned.
   */
  public explore(target: Controller): PatternProperties[] {
    return this.scan(target, Object.getPrototypeOf(target));
  }

  /**
   * Scan for client hooks in given target.
   *
   * @param {Controller} target Target controller to be scanned.
   */
  public* scanForClientHooks(target: Controller): IterableIterator<ClientProperties> {
    for (const propertyKey in target) {
      if (isFunction(propertyKey)) {
        continue;
      }

      const property = String(propertyKey);
      const isClient = Reflect.getMetadata(CLIENT_METADATA, target, property);
      if (isUndefined(isClient)) {
        continue;
      }

      const metadata = Reflect.getMetadata(CLIENT_CONFIGURATION_METADATA, target, property);
      yield { property, metadata };
    }
  }

  private scan(target: Controller, prototype: any): PatternProperties[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((property) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
        if (descriptor.set || descriptor.get) {
          return false;
        }

        return !isConstructor(property) && isFunction(prototype[property]);
      })
      .map((property) => this.exploreMetadata(target, prototype, property))
      .filter((metadata) => metadata !== null);
  }

  private exploreMetadata(target: Controller, prototype: any, methodName: string): PatternProperties {
    const callback = prototype[methodName];
    const isPattern = Reflect.getMetadata(PATTERN_HANDLER_METADATA, callback);
    if (isUndefined(isPattern)) {
      return null;
    }

    const pattern = Reflect.getMetadata(PATTERN_METADATA, callback);

    return {
      callback: (<Function>callback).bind(target),
      pattern,
    };
  }
}

/**
 * Client properties.
 */
export interface ClientProperties {
  /**
   * Property name.
   */
  property: string;
  /**
   * Metadata config.
   */
  metadata: ClientMetadata;
}

/**
 * Pattern message properties.
 */
export interface PatternProperties {
  /**
   * Message pattern.
   */
  pattern: PatternMetadata;
  /**
   * Callback function.
   */
  callback: Function;
}
