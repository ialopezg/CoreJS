import 'reflect-metadata';

import { InvalidPathVariableException } from '../../errors';
import { RequestMethod } from '../enums';
import { RequestMappingMetadata } from '../interfaces';

/**
 * Define the request mapping metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const RequestMapping = (metadata: RequestMappingMetadata): MethodDecorator => {
  if (typeof metadata.path === 'undefined') {
    throw new InvalidPathVariableException('RequestMapping');
  }

  const method = metadata.method || RequestMethod.GET;

  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Reflect.defineMetadata('path', metadata.path, descriptor.value);
    Reflect.defineMetadata('method', method, descriptor.value);

    return descriptor;
  };
};
