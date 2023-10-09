import 'reflect-metadata';

import { PathProps } from '../interfaces';
import { RequestMethod } from '../enums';

/**
 * Provides the functionality to a route path.
 *
 * @param {PathProps} props Path feature definitions.
 *
 * @constructor
 */
export const RequestMapping = (props: PathProps): MethodDecorator => {
  const requestMethod = props.method || RequestMethod.GET;

  return (target, key, descriptor) => {
    Reflect.defineMetadata('path', props.path, descriptor.value);
    Reflect.defineMetadata('method', requestMethod, descriptor.value);

    return descriptor;
  };
};
