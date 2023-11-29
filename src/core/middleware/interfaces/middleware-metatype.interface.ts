import { IMiddleware } from './middleware.interface';
import { MetaType } from '../../../common/interfaces';

/**
 * Takes a set of parameters and returns a middleware object type.
 */
export interface MiddlewareMetaType extends MetaType<IMiddleware> {}
