import 'reflect-metadata';

import { GATEWAY_SERVER_METADATA } from '../constants';

/**
 * Provides the functionality as a Gateway Server object.
 *
 * @param {Object} target Gateway server feature definitions.
 * @param {string|symbol} propertyKey Property name.
 *
 * @constructor
 */
export const GatewayServer: PropertyDecorator = (
  target: Object,
  propertyKey: string | symbol,
): void => {
  Reflect.set(target, propertyKey, null);
  Reflect.defineMetadata(GATEWAY_SERVER_METADATA, true, target, propertyKey);
};
