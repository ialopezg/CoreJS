import 'reflect-metadata';

import { ControllerMetadata } from '../interfaces';

/**
 * Define the controller metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Controller = (metadata: ControllerMetadata): ClassDecorator => {
  return (target: Object) => {
    Reflect.defineMetadata('path', metadata.path, target);
  };
};
