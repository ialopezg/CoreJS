import 'reflect-metadata';
import { PATH_METADATA } from '../constants';
import { isUndefined } from '../helpers';

import { ControllerMetadata } from '../interfaces';

const defaultMetadata: ControllerMetadata = { [PATH_METADATA]: '/' };

/**
 * Define the controller metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Controller = (metadata: ControllerMetadata = defaultMetadata): ClassDecorator => {
  if (isUndefined(metadata[PATH_METADATA])) {
    metadata[PATH_METADATA] = '/';
  }

  return (target: Object) => {
    Reflect.defineMetadata(PATH_METADATA, metadata[PATH_METADATA], target);
  };
};
