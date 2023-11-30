import { Controller, ControllerMetadata } from '../../../common/interfaces';
import { RequestMethod } from '../../../common';

/**
 * Represents the middleware configuration for a module.
 */
export interface MiddlewareConfiguration {
  /**
   * Middleware objects
   */
  middlewares: any;
  /**
   * Route list or objects.
   */
  forRoutes: (Controller | ControllerMetadata & { method?: RequestMethod })[];
}
