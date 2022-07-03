import { NextFunction, Request, Response } from 'express';
import { Controller, ControllerMetadata } from '../interfaces';

/**
 * Middleware COnfigutation Builder.
 */
export class MiddlewareBuilder {
  private readonly configs: MiddlewareConfiguration[] = [];

  /**
   * Stores given middleware configuration.
   *
   * @param config MIddleware configuration.
   */
  use(config: MiddlewareConfiguration): MiddlewareBuilder {
    this.configs.push(config);

    return this;
  }

  /**
   * Builds current middleware configuration.
   *
   * @returns The applicable list of configs for a Middleware.
   */
  build(): MiddlewareConfiguration[] {
    return this.configs.slice(0);
  }
}

/**
 * Middleware configuration.
 */
export interface MiddlewareConfiguration {
  middlewares: Middleware | Middleware[];
  forRoutes: (Controller | ControllerMetadata)[];
}

/**
 * Middleware object.
 */
export interface Middleware {
  /**
   * MIddleware configuration resolver.
   */
  resolve: () => (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => void;
}
