import 'reflect-metadata';

import { ControllerMetadata } from '../interfaces';

const defaultMetadata = { path: '/' };

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
  if (typeof metadata.path === 'undefined') {
    metadata.path = '/';
  }

  return (target) => {
    Reflect.defineMetadata('path', metadata.path, target);
  };
};
