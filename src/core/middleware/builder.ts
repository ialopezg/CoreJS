import { NextFunction, Request, Response } from 'express';
import { ControllerProps, IController } from '../interfaces';

/**
 * Middleware configuration builder.
 */
export class MiddlewareBuilder {
  private readonly configurations: MiddlewareConfiguration[] = [];


  /**
   * Builds the middleware configurations.
   */
  public build() {
    return this.configurations.slice(0);
  }

  /**
   * Sets the middleware configuration for routes.
   *
   * @param {MiddlewareConfiguration} configuration Configuration to be used.
   */
  public use(configuration: MiddlewareConfiguration): MiddlewareBuilder {
    this.configurations.push(configuration);

    return this;
  }
}

/**
 * Middleware configuration.
 */
export interface MiddlewareConfiguration {
  /**
   * Registered middlewares.
   */
  middlewares: IMiddleware | IMiddleware[];
  /**
   * Routes to apply the middlewares.
   */
  forRoutes: (IController | ControllerProps)[];
}

/**
 * Represents a middleware instance that will be applied to request routes.
 */
export interface IMiddleware {
  /**
   * Resolve a middleware instance.
   *
   * @param {Request} request Request object.
   * @param {Response} response Response object.
   * @param {NextFunction} next Next function.
   */
  resolve: () => (request: Request, response: Response, next: NextFunction) => void;
}
