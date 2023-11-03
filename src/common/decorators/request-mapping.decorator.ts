import 'reflect-metadata';

import { RequestMappingMetadata } from '../interfaces';
import { RequestMethod } from '../enums';
import { METHOD_METADATA, PATH_METADATA } from '../constants';

const defaultMetadata: RequestMappingMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET,
};

/**
 * Provides the functionality to a route path.
 *
 * @param {RequestMappingMetadata} metadata Path feature definitions.
 *
 * @constructor
 */
export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
  const path = metadata[PATH_METADATA] ?? '/';
  const method = metadata[METHOD_METADATA] || RequestMethod.GET;

  return (_target, _key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);

    return descriptor;
  };
};
