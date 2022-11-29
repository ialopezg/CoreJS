import 'reflect-metadata';

import {
  MESSAGE_PATTERN_HANDLER_METADATA,
  MESSAGE_PATTERN_METADATA,
} from '../constants';
import { MessagePatternMetadata } from '../interfaces';

/**
 * Define the message pattern metadata on the target.
 *
 * @param metadata An object that contains attached metadata.
 * @constructor
 */
export const MessagePattern = (metadata?: MessagePatternMetadata | string): MethodDecorator => {
  return (target: Object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Reflect.defineMetadata(MESSAGE_PATTERN_METADATA, metadata, descriptor.value);
    Reflect.defineMetadata(MESSAGE_PATTERN_HANDLER_METADATA, true, descriptor.value);

    return descriptor;
  };
};
