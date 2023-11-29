import 'reflect-metadata';

import { GatewayMetadata } from '../interfaces';
import {
  GATEWAY_METADATA,
  NAMESPACE_METADATA,
  PORT_METADATA,
} from '../constants';

/**
 * Provides the functionality as a Web Socket Gateway.
 *
 * @param {GatewayMetadata} metadata Gateway feature definitions.
 *
 * @constructor
 */
export const WebSocketGateway = (metadata?: GatewayMetadata): ClassDecorator => {
  metadata = metadata ?? {};

  return (target) => {
    Reflect.defineMetadata(GATEWAY_METADATA, true, target);
    Reflect.defineMetadata(NAMESPACE_METADATA, metadata.namespace, target);
    Reflect.defineMetadata(PORT_METADATA, metadata.port, target);
  };
};
