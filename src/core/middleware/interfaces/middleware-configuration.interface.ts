import { Controller, ControllerMetadata } from '../../../common/interfaces';
import { RequestMethod } from '../../../common';
import { MiddlewareMetaType } from './middleware-metatype.interface';

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
