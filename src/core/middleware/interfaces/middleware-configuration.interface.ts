import { IController, ControllerMetadata } from '../../../common/interfaces';
import { RequestMethod } from '../../../common';
import { IMiddlewareProto } from './middleware-proto.interface';

/**
 * Represents the middleware configuration for a module.
 */
export interface MiddlewareConfiguration {
  /**
   * Middleware lists
   */
  middlewares: IMiddlewareProto | IMiddlewareProto[];
  /**
   * Controller or controller props list.
   */
  forRoutes: (IController | ControllerMetadata & { method?: RequestMethod })[];
}
