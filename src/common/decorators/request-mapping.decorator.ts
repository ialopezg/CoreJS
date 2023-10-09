import 'reflect-metadata';

import { RequestMappingMetadata } from '../interfaces';
import { RequestMethod } from '../enums';
import { InvalidRequestMappingPathException } from '../../errors/exceptions/invalid-request-mapping-path.exception';

/**
 * Provides the functionality to a route path.
 *
 * @param {RequestMappingMetadata} metadata Path feature definitions.
 *
 * @constructor
 */
export const RequestMapping = (metadata: RequestMappingMetadata): MethodDecorator => {
  if (typeof metadata.path === 'undefined') {
    throw new InvalidRequestMappingPathException();
  }
  const requestMethod = metadata.method || RequestMethod.GET;

  return (target, key, descriptor) => {
    Reflect.defineMetadata('path', metadata.path, descriptor.value);
    Reflect.defineMetadata('method', requestMethod, descriptor.value);

    return descriptor;
  };
};
