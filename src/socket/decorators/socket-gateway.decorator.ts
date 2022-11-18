import 'reflect-metadata';

import { GATEWAY_METADATA, NAMESPACE_METADATA, PORT_METADATA } from '../constants';
import { GatewayMetadata } from '../interfaces';

export const SocketGateway = (metadata?: GatewayMetadata): ClassDecorator => {
  metadata = metadata || {};

  return (target: Object) => {
    Reflect.defineMetadata(GATEWAY_METADATA, true, target);
    Reflect.defineMetadata(NAMESPACE_METADATA, metadata.namespace, target);
    Reflect.defineMetadata(PORT_METADATA, metadata.port, target);
  };
};
