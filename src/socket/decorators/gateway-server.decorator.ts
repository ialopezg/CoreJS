import 'reflect-metadata';

import { GATEWAY_SERVER_METADATA } from '../constants';

export const GatewayServer: PropertyDecorator = (target: Object, key: string | symbol): void => {
  Reflect.set(target, key, null);
  Reflect.defineMetadata(GATEWAY_SERVER_METADATA, true, target, key);
};
