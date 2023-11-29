import 'reflect-metadata';

import { DESIGN_PARAM_TYPES_METADATA } from '../constants';

/**
 * Inject dependencies to the target class.
 *
 * @param {any[]} metadata Feature definitions.
 *
 * @constructor
 */
export const Dependencies = (metadata: any[]): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(DESIGN_PARAM_TYPES_METADATA, metadata, target);
  };
};
