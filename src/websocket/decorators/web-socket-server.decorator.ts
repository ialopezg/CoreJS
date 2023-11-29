import 'reflect-metadata';

import { GATEWAY_SERVER_METADATA } from '../constants';

/**
 * Provides the functionality as a Web Socket Server object.
 *
 * @constructor
 */
export const WebSocketServer = (): PropertyDecorator => (
  target: Object,
  propertyKey: string | symbol,
): void => {
  Reflect.set(target, propertyKey, null);
  Reflect.defineMetadata(GATEWAY_SERVER_METADATA, true, target, propertyKey);
};
