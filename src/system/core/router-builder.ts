import 'reflect-metadata';

import { ErrorRequestHandler, RequestHandler, Router } from 'express';

import { RequestMethod } from './enums';
import { Controller } from './interfaces';
import { isConstructor, validatePath } from '../../common';

/**
 * Application Router Builder.
 */
export class RouterBuilder {
  /**
   * Creates a new instance of RouterBuilder class.
   *
   * @param routerFactory Router factory.
   */
  constructor(private readonly factory: Function) {}

  /**
   * Build routes for given Controller and Router function.
   *
   * @param instance Controller instance.
   * @param route Router function.
   */
  build(instance: Controller, route: Function) {
    const router = this.factory();
    const path = RouterBuilder.fetchRouterPath(route);
    const routes = RouterBuilder.scanForPaths(instance);
    RouterBuilder.applyPathsToRouter(router, routes);

    return { path, router };
  }

  /**
   * Fetch a path for given route function.
   *
   * @param route Route function.
   * @private
   */
  private static fetchRouterPath(route: Function): string {
    const path: string = Reflect.getMetadata('path', route);

    return RouterBuilder.validatePath(path);
  }

  /**
   * Validate a path.
   *
   * @param path Path to be evaluated.
   * @private
   */
  private static validatePath(path: string): string {
    if (!path) {
      throw new Error(
        '"Path" property not defined in @RequestMapping() annotation!',
      );
    }

    return validatePath(path);
  }

  /**
   * Scans paths for given Controller.
   *
   * @param target Controller to be evaluated.
   * @private
   */
  private static scanForPaths(target: Controller): RoutePathProperties[] {
    const routes: RoutePathProperties[] = [];

    const prototype = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(prototype).filter(
      (method: string) => !isConstructor(method),
    );

    for (const method of methods) {
      const routePath = RouterBuilder.exploreMethodMetadata(
        target,
        prototype,
        method,
      );
      if (routePath) {
        routes.push(routePath);
      }
    }

    return routes;
  }

  /**
   * Explore metadata information for current object and bind it to given object.
   *
   * @param instance Instance to be bind.
   * @param prototype Object to be explored.
   * @param methodName Method to be explored.
   *
   * @returns A RouterPathProperty object with metadata information parsed.
   * @private
   */
  private static exploreMethodMetadata(
    instance: Controller,
    prototype: any,
    methodName: string,
  ): RoutePathProperties | any {
    const method: RequestHandler | ErrorRequestHandler = prototype[methodName];

    let routePath: string = Reflect.getMetadata('path', method);
    if (!routePath) {
      return null;
    }

    routePath = RouterBuilder.validatePath(routePath);
    const requestMethod: RequestMethod = Reflect.getMetadata('method', method);

    return {
      path: routePath,
      method: requestMethod,
      callback: (<Function>method).bind(instance),
    };
  }

  /**
   * Applies paths provided to default Router function.
   *
   * @param router Router function.
   * @param routePaths Path to be applied.
   * @private
   */
  private static applyPathsToRouter(
    router: Router,
    routePaths: RoutePathProperties[],
  ): void {
    (routePaths || []).map((route: RoutePathProperties) => {
      RouterBuilder.bindMethodToRouter(router, route);
    });
  }

  /**
   * Bind a route to given Router function.
   *
   * @param router Router function.
   * @param route Route object.
   * @private
   */
  private static bindMethodToRouter(
    router: Router,
    route: RoutePathProperties,
  ): void {
    const { path, method, callback } = route;

    const routerMethod = RouterBuilder.retrieveRouterMethod(router, method);
    routerMethod(path, callback);
  }

  /**
   * Retrieve the router method for current request method.
   *
   * @param router Router object.
   * @param method Request method.
   *
   * @returns The requested router object method.
   * @private
   */
  private static retrieveRouterMethod(
    router: Router,
    method: RequestMethod,
  ): any {
    switch (method) {
      case RequestMethod.POST:
        return router.post.bind(router);
      default:
        return router.get.bind(router);
    }
  }
}

/**
 * Route path property.
 */
interface RoutePathProperties {
  /**
   * Route path.
   */
  path: string;

  /**
   * Route method
   */
  method: RequestMethod;

  /**
   * Route callback.
   */
  callback: RequestHandler | ErrorRequestHandler | any;
}
