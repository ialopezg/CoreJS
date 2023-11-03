import 'reflect-metadata';

import { PARAM_TYPES_METADATA } from '../constants';

/**
 * Provides the functionality to delegate instantiation of dependencies to the
 * IoC container.
 *
 * @param {any[]} metadata Module feature definitions.
 *
 * @constructor
 */
export const Inject = (metadata: any[]): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(PARAM_TYPES_METADATA, metadata, target);
  };
};
