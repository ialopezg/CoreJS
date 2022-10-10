import 'reflect-metadata';

import { Router } from 'express';
import { RequestMethod } from '../../common';

import { Controller } from '../../common/interfaces';
import { UnknownRequestMappingException } from '../../errors/exceptions';
import { ExpressAdapter } from '../adapters';
import { RouterProxy, RouterProxyCallback } from './proxy';

/**
 * Defines a Route path properties.
 */
interface RoutePathProperties {
  /**
   * Route path.
   */
  path: string,
  /**
   * HTTP request method.
   */
  method: RequestMethod,
  /**
   * Callback to be bind.
   */
  callback: RouterProxyCallback,
}

/**
 * Defines a router builder object.
 */
export class RouterBuilder {
  /**
   * Creates a new instance of this class with given parameters.
   *
   * @param proxy Router proxy object.
   * @param adapter Express adapter object.
   */
  constructor(
    private readonly proxy?: RouterProxy,
    private readonly adapter?: ExpressAdapter,
  ) {}

  /**
   * Builds routes for given controller instance.
   *
   * @param instance Controller instance.
   * @param prototype Controller prototype.
   *
   * @returns The path for given controller with a function bound.
   */
  build(instance: Controller, prototype: Function) {
    const router = (this.adapter as any).createRouter();
    const path = RouterBuilder.fetchRouterPath(prototype);
    const paths = this.scanForPaths(instance);

    this.applyPathsToRouterProxy(router, paths);

    return { path, router };
  }

  /**
   * Applies given paths to a router proxy.
   *
   * @param router Express Router instance to be used.
   * @param paths Path property to be applied.
   */
  applyPathsToRouterProxy(router: Router, paths: RoutePathProperties[]) {
    (paths || []).forEach((path: RoutePathProperties) => {
      this.bindMethodToRouterProxy(router, path);
    });
  }

  /**
   * Bind a method to given router as proxy.
   *
   * @param router Express Router instance to be used.
   * @param pathProperty Path property to be bind.
   */
  bindMethodToRouterProxy(router: Router, pathProperty: RoutePathProperties) {
    const { path, method, callback } = pathProperty;

    const routerMethod = RouterBuilder.findRouterMethod(router, method).bind(router);
    const proxy = this.proxy.create(callback);

    routerMethod(path, proxy);
  }

  /**
   * Finds the proper HTTP method callback for given request method.
   *
   * @param router Express Router instance to be used.
   * @param requestMethod HTTP Request method.
   *
   * @returns The proper HTTP method callback.
   */
  private static findRouterMethod(router: Router, requestMethod: RequestMethod): any {
    switch (requestMethod) {
      case RequestMethod.ALL:
        return router.all;
      case RequestMethod.DELETE:
        return router.delete;
      case RequestMethod.POST:
        return router.post;
      case RequestMethod.PUT:
        return router.put;
      default:
        return router.get;
    }
  }

  /**
   * Scans given instance for paths and bind them to itself.
   *
   * @param instance Instance to be analyzed and bound.
   *
   * @returns A collection containing the callback functions, paths, and request
   */
  scanForPaths(instance: Controller): RoutePathProperties[] {
    return this.scanPathsFromPrototype(instance, Object.getPrototypeOf(instance));
  }

  /**
   * Scans given prototype for paths and bind them to Controller instance provided.
   *
   * @param instance Controller instance to be bound.
   * @param prototype Prototype to be scanned.
   *
   * @returns A collection containing the callback functions, paths, and request method actions.
   */
  scanPathsFromPrototype(instance: Controller, prototype: any): RoutePathProperties[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((method: string) => method !== 'constructor')
      .map((method: string) => this.exploreMethodMetadata(instance, prototype, method))
      .filter((path: RoutePathProperties) => path !== null);
  }

  /**
   * Explore a method name from the given prototype and bind it to Controller instance provided.
   *
   * @param instance Controller instance to be bound.
   * @param prototype Prototype to be scanned.
   * @param methodName Method name requested.
   * @returns An object containing the callback function, path, and request method action.
   */
  exploreMethodMetadata(instance: Controller, prototype: any, methodName: string): RoutePathProperties {
    const callback = prototype[methodName];

    const path = Reflect.getMetadata('path', callback);

    if (typeof path === 'undefined') {
      return null;
    }

    const method: RequestMethod = Reflect.getMetadata('method', callback);

    return {
      path: RouterBuilder.validateRoutePath(path),
      method,
      callback: (<Function>callback).bind(instance),
    };
  }

  /**
   * Fetch the path for given router.
   *
   * @param prototype Router prototype function.
   *
   * @returns The router path requested.
   */
  private static fetchRouterPath(prototype: Function): string {
    const path = Reflect.getMetadata('path', prototype);

    return RouterBuilder.validateRoutePath(path);
  }

  /**
   * Validate and normalize a route path.
   *
   * @param path Path to be validated.
   *
   * @returns The path validate and normalize.
   */
  private static validateRoutePath(path: string): string {
    if (typeof path === 'undefined') {
      throw new UnknownRequestMappingException();
    }

    return (path.charAt(0) !== '/') ? '/' + path : path;
  }
}
