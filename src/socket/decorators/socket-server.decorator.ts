import 'reflect-metadata';

export const SocketServer: PropertyDecorator = (target: Object, key: string | symbol): void => {
  Reflect.set(target, key, null);
  Reflect.defineMetadata('__isSocketServer', true, target, key);
};
