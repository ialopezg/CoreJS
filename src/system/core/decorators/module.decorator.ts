import 'reflect-metadata';

import { ModuleMetadata } from '../interfaces';

export const Module = (metadata: ModuleMetadata): ClassDecorator => {
  return (target: Object) => {
    for (let metadataKey in metadata) {
      if ({}.hasOwnProperty.call(metadata, metadataKey)) {
        Reflect.defineMetadata(metadataKey, metadata[metadataKey], target);
      }
    }
  };
};
