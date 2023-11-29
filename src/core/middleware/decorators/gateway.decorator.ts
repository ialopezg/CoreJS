import 'reflect-metadata';

import { GatewayProps } from '../interfaces';

/**
 * Provides the SocketIO Server functionality to a component.
 *
 * @param {GatewayProps} props SocketIO Server attributes.
 *
 * @constructor
 */
export const SocketGateway = (props?: GatewayProps): ClassDecorator => {
  props = props || {};
  return (target: Object) => {
    Reflect.defineMetadata('__isGateway', true, target);
    Reflect.defineMetadata('namespace', props.namespace, target);
  };
};
