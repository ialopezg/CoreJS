import 'reflect-metadata';

import { isFunction } from '@ialopezg/commonjs';

import { SELF_PARAM_TYPES_METADATA } from '../constants';

/**
 * Provides the functionality to delegate instantiation of dependencies to the
 * IoC container.
 *
 * @param {any} metadata Module feature definitions.
 *
 * @constructor
 */
export const Inject = (metadata: any): ParameterDecorator => {
  return (target, _key, index) => {
    const selfArgs = Reflect.getMetadata(SELF_PARAM_TYPES_METADATA, target) || [];
    const type = isFunction(metadata) ? metadata.name : metadata;

    selfArgs.push({ index, param: type });
    Reflect.defineMetadata(SELF_PARAM_TYPES_METADATA, selfArgs, target);
  }
};
