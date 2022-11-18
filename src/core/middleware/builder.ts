import { isUndefined } from '../../common';
import { InvalidMiddlewareConfigurationException } from '../../errors/exceptions';
import { MiddlewareConfiguration } from './interfaces';

/**
 * Defines a class that build the configuration for all Middleware objects.
 */
export class MiddlewareBuilder {
  private readonly configs = new Set<MiddlewareConfiguration>();

  /**
   * Use given configuration over route collection in the collection.
   *
   * @param configuration Configuration to be applied over the route or route collection.
   *
   * @returns An instance of this class
   */
  use(configuration: MiddlewareConfiguration): MiddlewareBuilder {
    if (isUndefined(configuration.middlewares) || isUndefined(configuration.forRoutes)) {
      throw new InvalidMiddlewareConfigurationException();
    }

    this.configs.add(configuration);

    return this;
  }

  /**
   * Builds the middleware configuration to be applied.
   *
   * @returns A MiddlewareConfiguration collection.
   */
  build(): any {
    return [...this.configs];
  }
}
