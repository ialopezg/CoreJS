import { InvalidMiddlewareConfigurationException } from '../../errors';
import { MiddlewareConfiguration } from './interfaces';

/**
 * Creates and applies middleware configurations
 */
export class MiddlewareBuilder {
  private readonly configs = new Set<MiddlewareConfiguration>();

  /**
   * Set the middleware configuration to be used.
   *
   * @param {MiddlewareConfiguration} configuration Configuration to be applied.
   */
  public use(configuration: MiddlewareConfiguration) {
    if (
      typeof configuration.middlewares === 'undefined' ||
      typeof configuration.forRoutes === 'undefined'
    ) {
      throw new InvalidMiddlewareConfigurationException();
    }

    this.configs.add(configuration);

    return this;
  }

  /**
   * Builds the middleware configuration.
   */
  public build(): MiddlewareConfiguration[] {
    return [...this.configs];
  }
}
