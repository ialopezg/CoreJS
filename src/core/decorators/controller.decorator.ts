import 'reflect-metadata';

import { PathProps } from '../interfaces';

/**
 * Provides the functionality (path) to an application endpoint.
 *
 * @param {ModuleProps} props Controller feature definitions.
 *
 * @constructor
 */
export const Controller = (props: PathProps): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata('path', props.path, target);
  };
};
