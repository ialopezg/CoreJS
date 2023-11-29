import 'reflect-metadata';

import { isUndefined } from '@ialopezg/commonjs';

import { PATH_METADATA } from '../../common/constants';
import { Controller, ControllerMetadata } from '../../common/interfaces';
import { RequestMethod, validatePath } from '../../common';
import { UnknownRequestMappingException } from '../../errors';
import { RouterBuilder } from '../router';

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
    controller: Controller | ControllerMetadata & { method?: RequestMethod },
  ): Array<{ path: string, method: RequestMethod }> {
    const path: string = Reflect.getMetadata(PATH_METADATA, controller);
    if (isUndefined(path)) {
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

  private mapToRouteProps(
    route: ControllerMetadata & { method?: RequestMethod },
  ): { path: string, method: RequestMethod } {
    const { path, method } = route;
    if (isUndefined(path)) {
      throw new UnknownRequestMappingException();
    }

    return {
      path: this.validateRoutePath(path),
      method: isUndefined(method) ? RequestMethod.ALL : method,
    };
  }

  private validateRoutePath(path: string): string {
    return validatePath(path);
  }
}
