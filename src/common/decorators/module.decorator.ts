import 'reflect-metadata';

import { ModuleMetadata } from '../interfaces';
import { InvalidModuleConfigurationException } from '../../errors';
import { MODULE_METADATA } from '../constants';

/**
 * Provides the functionality (modules, components or services, and routes) to an application module.
 *
 * @param {ModuleMetadata} metadata Module feature definitions.
 *
 * @constructor
 */
export const Module = (metadata: ModuleMetadata): ClassDecorator => {
  const keys = Object.keys(metadata);
  const allowed = [...(Object.values(MODULE_METADATA) as string[])];
  
  keys.forEach((key) => {
    if (!allowed.includes(key)) {
      throw new InvalidModuleConfigurationException(key);
    }
  });

  return (target) => {
    for (const property in metadata) {
      if (({}).hasOwnProperty.call(metadata, property)) {
        Reflect.defineMetadata(property, metadata[property], target);
      }
    }
  };
};
