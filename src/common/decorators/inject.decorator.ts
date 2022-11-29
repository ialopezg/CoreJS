import 'reflect-metadata';

import { PARAM_TYPES_METADATA } from '../constants';

/**
 * Define the Inject metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Inject = (metadata: any[]): ClassDecorator => {
  return (target: Object) => {
    Reflect.defineMetadata(PARAM_TYPES_METADATA, metadata, target);
  };
};
