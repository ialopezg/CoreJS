import { RequestMethod } from '../../../common';
import { Controller, ControllerMetadata } from '../../../common/interfaces';
import { MiddlewareProto } from './middleware-proto.interface';

/**
 * Defines a prototype for MiddlewareConfiguration objects.
 */
export interface MiddlewareConfiguration {
  /**
   * Middleware collection to be applied in route collection.
   */
  middlewares: MiddlewareProto | MiddlewareProto[];
  /**
   * Routes collection.
   */
  forRoutes: (Controller | ControllerMetadata & { method?: RequestMethod })[];
}
