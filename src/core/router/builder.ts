import { IRouterMatcher, Router } from 'express';

import { IController } from '../../common/interfaces';
import { RequestMethod } from '../../common';
import { UnknownRequestMappingException } from '../../errors';
import { ExpressAdapter } from '../adapters';
import { RouterProxy, RouterProxyCallback } from './proxy';

/**
 * Creates the router functions available in the whole application.
 */
export class RouterBuilder {
  /**
   * Creates a new instance of RouterBuilder class.
   *
   * @param {RouterProxy} proxy Router proxy.
   * @param adapter
   */
  constructor(
    private readonly proxy?: RouterProxy,
    private readonly adapter?: ExpressAdapter,
  ) {}

  /**
   * Builds the router function for given controller.
   *
   * @param {IController} controller Controller.
   * @param {IController} prototype Controller type.
   */
  public build(
    controller: IController,
    prototype: IController,
  ): { path: string, router: Router } {
    const router = (<any>this.adapter).createRouter();
    const path = this.fetchRouterPath(prototype);
    const paths = this.scanForPaths(controller);

    this.apply(router, paths);

    return { path, router };
  }

  /**
   * Scans for a path from given controller type.
   *
   * @param {Controller} controller Controller.
   * @param {Controller} prototype Controller type.
   */
  public scanForPathsFromPrototype(controller: IController, prototype: IController): RoutePathProperties[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((property) => property !== 'constructor')
      .map((property) => this.exploreMethodMetadata(controller, prototype, property))
      .filter((property) => property !== null);
  }

  public scanForPaths(controller: IController) {
    return this.scanForPathsFromPrototype(
      controller,
      Object.getPrototypeOf(controller),
    );
  }

  private apply(router: Router, paths: RoutePathProperties[]) {
    (paths || []).map((route) => {
      this.bind(router, route);
    });
  }

  bind(router: Router, pathProperties: RoutePathProperties) {
    const { path, method, callback } = pathProperties;

    const routerMethod = this.findRouterMethod(router, method).bind(router);
    const proxy = this.proxy.createProxy(callback);

    routerMethod(path, proxy);
  }

  private exploreMethodMetadata(
    controller: IController,
    prototype: IController,
    methodName: string,
  ): RoutePathProperties {
    const callback = prototype[methodName];
    const path = Reflect.getMetadata('path', callback);
    if (typeof path === 'undefined') {
      return null;
    }

    const method: RequestMethod = Reflect.getMetadata('method', callback);

    return {
      path: this.validateRoutePath(path),
      method,
      callback: (<Function>callback).bind(controller),
    };
  }

  private fetchRouterPath(prototype: IController): string {
    return this.validateRoutePath(Reflect.getMetadata('path', prototype));
  }

  private findRouterMethod(router: Router, requestMethod: RequestMethod): IRouterMatcher<Router> {
    switch (requestMethod) {
      case RequestMethod.POST:
        return router.post;
      case RequestMethod.ALL:
        return router.all;
      case RequestMethod.DELETE:
        return router.delete;
      case RequestMethod.PUT:
        return router.put;
      default:
        return router.get;
    }
  }

  private validateRoutePath(path: string): string {
    if (typeof path === 'undefined') {
      throw new UnknownRequestMappingException();
    }

    return (path.charAt(0) !== '/') ? '/' + path : path;
  }
}

/**
 * Route path properties.
 */
export interface RoutePathProperties {
  /**
   * Path.
   */
  path: string;
  /**
   * HTTP method.
   */
  method: RequestMethod;
  /**
   * Callback.
   */
  callback: RouterProxyCallback;
}
