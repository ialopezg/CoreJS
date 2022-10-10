import 'reflect-metadata';

import { InvalidModuleConfigurationException } from '../../errors';
import { ModuleMetadata } from '../interfaces';

/**
 * Define the module metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Module = (metadata: ModuleMetadata): ClassDecorator => {
  const properties = Object.keys(metadata);
  const acceptableProperties = ['modules', 'components', 'controllers', 'exports'];

  properties.forEach((property: string) => {
    if (acceptableProperties.findIndex((param: string) => param === property) < 0) {
      throw new InvalidModuleConfigurationException(property);
    }
  });

  return (target: Object) => {
    for (const property in metadata) {
      if ({}.hasOwnProperty.call(metadata, property)) {
        Reflect.defineMetadata(property, metadata[property], target);
      }
    }
  };
};
