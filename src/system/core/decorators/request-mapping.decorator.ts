import 'reflect-metadata';

import { RequestMappingMetadata } from '../interfaces';
import { RequestMethod } from '../enums';

export const RequestMapping = (
  metadata: RequestMappingMetadata,
): MethodDecorator => {
  const method = metadata.method || RequestMethod.GET;

  return (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    Reflect.defineMetadata('path', metadata.path, descriptor.value);
    Reflect.defineMetadata('method', method, descriptor.value);

    return descriptor;
  };
};
