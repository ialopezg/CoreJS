import { InvalidMiddlewareConfigurationException } from '../../errors';
import { MiddlewareConfiguration } from './interfaces';
import { isUndefined } from '@ialopezg/commonjs';

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
    const { middlewares, forRoutes } = configuration;
    if (isUndefined(middlewares) || isUndefined(forRoutes)) {
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
