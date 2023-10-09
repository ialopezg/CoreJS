import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when the annotation has invalid configuration.
 */
export class InvalidModuleConfigurationException extends RuntimeException {
  /**
   * Creates a new instance of InvalidModuleConfigurationException class.
   *
   * @param {string} property Module property name.
   */
  constructor(property: string) {
    super(`Invalid property [${property}] in @Module({}) annotation.`);
  }
}
