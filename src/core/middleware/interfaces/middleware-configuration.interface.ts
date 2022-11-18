import { RequestMethod } from '../../../common';
import { Controller, ControllerMetadata } from '../../../common/interfaces';

/**
 * Defines a prototype for MiddlewareConfiguration objects.
 */
export interface MiddlewareConfiguration {
  /**
   * Middleware collection to be applied in route collection.
   */
  middlewares: any;
  /**
   * Routes collection.
   */
  forRoutes: (Controller | ControllerMetadata & { method?: RequestMethod })[];
}
