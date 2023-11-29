import 'reflect-metadata';

import { ControllerMetadata } from '../interfaces';
import { PATH_METADATA } from '../constants';
import { isUndefined } from '@ialopezg/commonjs';

const defaultMetadata = { [PATH_METADATA]: '/' };

/**
 * Provides the Controller functionality to the annotated class.
 *
 * The annotated object will act a global path handler for an
 * application resource or endpoint.
 *
 * @param {ControllerMetadata} metadata Controller feature definitions.
 *
 * @constructor
 */
export const Controller = (
  metadata: ControllerMetadata = defaultMetadata,
): ClassDecorator => {
  if (isUndefined(metadata[PATH_METADATA])) {
    metadata[PATH_METADATA] = '/';
  }

  return (target) => {
    Reflect.defineMetadata(PATH_METADATA, metadata[PATH_METADATA], target);
  };
};
