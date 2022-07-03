import { GatewayMetadata } from '../interfaces';

/**
 * Define the socket gateway metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const SocketGateway = (metadata?: GatewayMetadata): ClassDecorator => {
  metadata = metadata || {};

  return (target: Object) => {
    Reflect.defineMetadata('__isGateway', true, target);
    Reflect.defineMetadata('namespace', metadata.namespace, target);
  };
};
