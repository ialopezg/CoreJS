import 'reflect-metadata';

import { InvalidModuleConfigurationException } from '../../errors/exceptions';
import { metadata } from '../constants';
import { ModuleMetadata } from '../interfaces';

/**
 * Define the module metadata on the target.
 *
 * @param props An object that contains attached metadata.
 * @constructor
 */
export const Module = (props: ModuleMetadata): ClassDecorator => {
  const properties = Object.keys(props);
  const acceptableProperties = [metadata.MODULES, metadata.CONTROLLERS, metadata.COMPONENTS, metadata.EXPORTS];

  properties.forEach((property: string) => {
    if (acceptableProperties.findIndex((param: string) => param === property) < 0) {
      throw new InvalidModuleConfigurationException(property);
    }
  });

  return (target: Object) => {
    for (const property in props) {
      if ({}.hasOwnProperty.call(props, property)) {
        Reflect.defineMetadata(property, props[property], target);
      }
    }
  };
};
