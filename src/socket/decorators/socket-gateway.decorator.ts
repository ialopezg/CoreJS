import 'reflect-metadata';

import { GatewayProps } from '../interfaces';

/**
 * Provides the functionality as a Gateway service object.
 *
 * @param {GatewayProps} props Gateway feature definitions.
 *
 * @constructor
 */
export const SocketGateway = (props?: GatewayProps): ClassDecorator => {
  props = props ?? {};

  return (target) => {
    Reflect.defineMetadata('__isGateway', true, target);
    Reflect.defineMetadata('namespace', props.namespace, target);
  };
};
