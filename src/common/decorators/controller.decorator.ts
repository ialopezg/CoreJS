import 'reflect-metadata';
import { PATH_METADATA } from '../constants';

import { ControllerMetadata } from '../interfaces';

const defaultMetadata: ControllerMetadata = { path: '/' };

/**
 * Define the controller metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Controller = (metadata: ControllerMetadata = defaultMetadata): ClassDecorator => {
  if (typeof metadata.path === 'undefined') {
    metadata.path = '/';
  }

  return (target: Object) => {
    Reflect.defineMetadata(PATH_METADATA, metadata.path, target);
  };
};
