import { GatewayMetadata } from '../interfaces';

export const SocketGateway = (metadata?: GatewayMetadata): ClassDecorator => {
  metadata = metadata || {};

  return (target: Object) => {
    Reflect.defineMetadata('__isGateway', true, target);
    Reflect.defineMetadata('namespace', metadata.namespace, target);
  };
};
