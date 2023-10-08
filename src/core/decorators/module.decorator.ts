import 'reflect-metadata';

import { ModuleProps } from '../interfaces';

/**
 * Provides the functionality (modules, components or services, and routes) to an application module.
 *
 * @param {ModuleProps} props Module feature definitions.
 *
 * @constructor
 */
export const Module = (props: ModuleProps): ClassDecorator => {
  return (target) => {
    for (const property in props) {
      if (({}).hasOwnProperty.call(props, property)) {
        Reflect.defineMetadata(property, props[property], target);
      }
    }
  };
};
