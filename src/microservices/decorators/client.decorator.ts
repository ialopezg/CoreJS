import 'reflect-metadata';

import { ClientMetadata } from '../interfaces';
import { CLIENT_CONFIGURATION_METADATA, CLIENT_METADATA } from '../constants';

/**
 * Provides the Client functionality to the annotated object.
 *
 * @param {ClientMetadata | string} metadata Client configuration.
 *
 * @constructor
 */
export const Client = (metadata?: ClientMetadata | string) => {
  return (target: Object, propertyKey: string | symbol): void => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(CLIENT_METADATA, true, target, propertyKey);
    Reflect.defineMetadata(
      CLIENT_CONFIGURATION_METADATA,
      metadata,
      target,
      propertyKey,
    );
  };
};
