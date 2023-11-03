import { PatternMetadata } from '../interfaces';
import { PATTERN_HANDLER_METADATA, PATTERN_METADATA } from '../constants';

/**
 * Provides the MessagePattern functionality to the annotated method.
 *
 * @param {ClientMetadata | string} metadata MessagePattern configuration.
 *
 * @constructor
 */
export const MessagePattern = (
  metadata?: PatternMetadata | string,
): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATTERN_METADATA, metadata, descriptor.value);
    Reflect.defineMetadata(PATTERN_HANDLER_METADATA, true, descriptor.value);

    return descriptor;
  };
}
