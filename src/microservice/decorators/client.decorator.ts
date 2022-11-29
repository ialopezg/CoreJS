import 'reflect-metadata';
import { CLIENT_CONFIGURATION_METADATA, CLIENT_METADATA } from '../constants';

import { ClientMetadata } from '../interfaces';

/**
 * Define the Client pattern metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Client = (metadata?: ClientMetadata) => {
  return (target: Object, propertyKey: string | symbol): void => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(CLIENT_METADATA, true, target, propertyKey);
    Reflect.defineMetadata(CLIENT_CONFIGURATION_METADATA, metadata, target, propertyKey);
  };
};
