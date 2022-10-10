import {
  InvalidMiddlewareConfigurationException,
} from '../../errors/exceptions/invalid-middleware-configuration.exception';
import { MiddlewareConfiguration } from './interfaces';

/**
 * Defines a class that build the configuration for all Middleware objects.
 */
export class MiddlewareBuilder {
  private readonly configs = new Set<MiddlewareConfiguration>();

  /**
   * Use given configuration over route collection in the collection.
   *
   * @param config Configuration to be applied over the route or route collection.
   *
   * @returns An instance of this class
   */
  use(config: MiddlewareConfiguration): MiddlewareBuilder {
    if (typeof config.middlewares === 'undefined' || typeof config.forRoutes === 'undefined') {
      throw new InvalidMiddlewareConfigurationException();
    }

    this.configs.add(config);

    return this;
  }

  /**
   * Builds the middleware configuration to be applied.
   *
   * @returns A MiddlewareConfiguration collection.
   */
  build(): MiddlewareConfiguration[] {
    return [...this.configs];
  }
}
