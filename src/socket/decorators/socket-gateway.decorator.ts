import 'reflect-metadata';

import { GatewayMetadata } from '../interfaces';

/**
 * Provides the functionality as a Gateway service object.
 *
 * @param {GatewayMetadata} metadata Gateway feature definitions.
 *
 * @constructor
 */
export const SocketGateway = (metadata?: GatewayMetadata): ClassDecorator => {
  metadata = metadata ?? {};

  return (target) => {
    Reflect.defineMetadata('__isGateway', true, target);
    Reflect.defineMetadata('namespace', metadata.namespace, target);
    Reflect.defineMetadata('port', metadata.port, target);
  };
};
