import 'reflect-metadata';

import { SOCKET_SERVER_METADATA } from '../constants';

/**
 * Provides the functionality as a Socket Server object.
 *
 * @param {Object} target Gateway feature definitions.
 * @param {string|symbol} propertyKey Property name.
 *
 * @constructor
 */
export const SocketServer: PropertyDecorator = (target: Object, propertyKey: string | symbol): void => {
  Reflect.set(target, propertyKey, null);
  Reflect.defineMetadata(SOCKET_SERVER_METADATA, true, target, propertyKey);
};
