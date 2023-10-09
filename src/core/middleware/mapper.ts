import 'reflect-metadata';

import { RouterBuilder } from '../router';
import { IController, ControllerMetadata } from '../../common/interfaces';
import { RequestMethod } from '../../common';
import { UnknownRequestMappingException } from '../../errors';

/**
 * Maps controller to router functions.
 */
export class RoutesMapper {
  private readonly builder = new RouterBuilder();

  /**
   * Map a controller object to a router function.
   *
   * @param {Controller | ControllerMetadata & { method?: RequestMethod }} controller Controller.
   */
  public map(
    controller: IController | ControllerMetadata & { method?: RequestMethod },
  ): Array<{ path: string, method: RequestMethod }> {
    const path: string = Reflect.getMetadata('path', controller);
    if (typeof path === 'undefined') {
      return [this.mapToRouteProps(controller)];
    }

    const paths = this.builder.scanForPathsFromPrototype(
      Object.create(controller),
      (<any>controller).prototype,
    );

    return paths.map((route): { path: string, method: RequestMethod } => ({
      path: this.validateRoutePath(path) + this.validateRoutePath(route.path),
      method: route.method,
    }));
  }

  private mapToRouteProps(route: ControllerMetadata & { method?: RequestMethod }) {
    if (typeof route.path === 'undefined') {
      throw new UnknownRequestMappingException();
    }

    return {
      path: this.validateRoutePath(route.path),
      method: (typeof route.method === 'undefined') ? RequestMethod.ALL : route.method,
    };
  }

  private validateRoutePath(path: string): string {
    return (path.charAt(0) !== '/') ? '/' + path : path;
  }
}
