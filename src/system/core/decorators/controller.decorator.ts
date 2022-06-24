import 'reflect-metadata';

import { ControllerMetadata } from '../interfaces';

export const Controller = (metadata: ControllerMetadata): ClassDecorator => {
  return (target: Object) => {
    Reflect.defineMetadata('path', metadata.path, target);
  };
};
