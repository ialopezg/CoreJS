import 'reflect-metadata';

import { ModuleMetadata } from '../interfaces';

/**
 * Define the module metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const Module = (metadata: ModuleMetadata): ClassDecorator => {
  return (target: Object) => {
    for (let metadataKey in metadata) {
      if ({}.hasOwnProperty.call(metadata, metadataKey)) {
        Reflect.defineMetadata(metadataKey, metadata[metadataKey], target);
      }
    }
  };
};
