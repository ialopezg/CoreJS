import 'reflect-metadata';

import { MESSAGE_MAPPING_METADATA, MESSAGE_METADATA } from '../constants';

const defaultMetadata = { value: '' };

/**
 * Provides the functionality as a Message Subscriber object.
 *
 * @param {{value: string}} metadata Gateway feature definitions.
 *
 * @constructor
 */
export const SubscribeMessage = (
  metadata: { value: string } = defaultMetadata,
): MethodDecorator => {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(MESSAGE_MAPPING_METADATA, true, descriptor.value);
    Reflect.defineMetadata(MESSAGE_METADATA, metadata.value, descriptor.value);

    return descriptor;
  }
};
