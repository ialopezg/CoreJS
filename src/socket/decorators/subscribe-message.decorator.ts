import 'reflect-metadata';

const defaultMetadata = { value: '' };

export const SubscribeMessage = (metadata: { value: string } = defaultMetadata): MethodDecorator => {
  return (_target: Object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Reflect.defineMetadata('__isMessageMapping', true, descriptor.value);
    Reflect.defineMetadata('message', metadata.value, descriptor.value);

    return descriptor;
  };
};
