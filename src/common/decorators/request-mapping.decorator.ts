import 'reflect-metadata';

import { METHOD_METADATA, PATH_METADATA } from '../constants';
import { RequestMethod } from '../enums';
import { RequestMappingMetadata } from '../interfaces';

const defaultMetadata = { path: '/', method: RequestMethod.GET };

/**
 * Define the request mapping metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const RequestMapping = (metadata: RequestMappingMetadata = defaultMetadata): MethodDecorator => {
  const path = metadata.path || '/';
  const method = metadata.method || RequestMethod.GET;

  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);

    return descriptor;
  };
};
