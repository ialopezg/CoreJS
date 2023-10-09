import 'reflect-metadata';

const defaultMetadata = { value: '' };

/**
 * Provides the functionality as a Message Subscriber object.
 *
 * @param {{value: string}} metadata Gateway feature definitions.
 *
 * @constructor
 */
export const SubscribeMessage = (metadata: { value: string } = defaultMetadata): MethodDecorator => {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("__isMessageMapping", true, descriptor.value);
    Reflect.defineMetadata("message", metadata.value, descriptor.value);

    return descriptor;
  }
};
