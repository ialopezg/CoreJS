import 'reflect-metadata';

import { SOCKET_SERVER_METADATA } from '../constants';

export const SocketServer: PropertyDecorator = (target: Object, key: string | symbol): void => {
  Reflect.set(target, key, null);
  Reflect.defineMetadata(SOCKET_SERVER_METADATA, true, target, key);
};
