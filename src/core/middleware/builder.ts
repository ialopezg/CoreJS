import { isNil, isUndefined } from "@ialopezg/commonjs";

import { Controller, ControllerMetadata, MetaType } from "../../common/interfaces";
import { BindResolveValues, LoggerService, RequestMethod } from "../../common";
import { InvalidMiddlewareConfigurationException } from "../../errors";
import { MiddlewareConfiguration } from "./interfaces";

/**
 * Creates and applies middleware configurations
 */
export class MiddlewareBuilder {
  private readonly logger = new LoggerService(MiddlewareBuilder.name);
  private readonly middlewares = new Set<MiddlewareConfiguration>();

  /**
   * Apply the configuration to given routes.
   *
   * @param {MetaType|Array<MetaType>} metaTypes Meta type objects.
   */
  public apply(
    metaTypes: MetaType<any> | Array<MetaType<any>>,
  ): MiddlewareConfigProxy {
    let params = null;

    const config = {
      with: (data: any) => {
        params = data;

        return config as MiddlewareConfigProxy;
      },
      forRoutes: (...routes: (Controller | ControllerMetadata & { method: RequestMethod })[]) => {
        if (isUndefined(routes)) {
          throw new InvalidMiddlewareConfigurationException();
        }

        const configuration: MiddlewareConfiguration = {
          middlewares: this.bindValuesToResolve(metaTypes, params),
          forRoutes: routes,
        };
        this.middlewares.add(configuration);

        return this;
      },
    };

    return config;
  }

  /**
   * Set the middleware configuration to be used.
   *
   * @param {MiddlewareConfiguration} configuration Configuration to be applied.
   *
   * @deprecated
   * Since version 1.0.0-alpha.10 this method is deprecated. Use apply() instead.
   */
  public use(configuration: MiddlewareConfiguration) {
    this.logger.warn(
      'DEPRECATED! Since version RC.6 `use()` method is deprecated. Use `apply()` instead.',
    );

    const { middlewares, forRoutes } = configuration;
    if (isUndefined(middlewares) || isUndefined(forRoutes)) {
      throw new InvalidMiddlewareConfigurationException();
    }

    this.middlewares.add(configuration);

    return this;
  }

  /**
   * Builds the middleware configuration.
   */
  public build(): MiddlewareConfiguration[] {
    return [...this.middlewares];
  }

  private bindValuesToResolve(
    middlewares: MetaType<any> | Array<MetaType<any>>,
    params: Array<any>,
  ): any[] {
    if (isNil(params)) {
      return middlewares as any[];
    }

    const args = BindResolveValues(params);

    return [].concat(middlewares).map(args);
  }
}

/**
 * Represents a middleware configuration proxy.
 */
export interface MiddlewareConfigProxy {
  /**
   * Inject given data to the config for specified routes.
   *
   * @param {any|any[]} data Data to be injected.
   */
  with: (...data: any[]) => MiddlewareConfigProxy;
  /**
   * Routes where the config will be applied.
   *
   * @param {any} routes Routes to be configured.
   */
  forRoutes: (...routes: (Controller | ControllerMetadata & { method: RequestMethod })[]) => MiddlewareBuilder;
}
