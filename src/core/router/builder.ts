import 'reflect-metadata';

import { Router } from 'express';

import {
  isConstructor, isFunction,
  isUndefined,
  LoggerService,
  METHOD_METADATA,
  PATH_METADATA,
  RequestMethod,
  validatePath,
} from '../../common';
import { Controller, MetaType } from '../../common/interfaces';
import { UnknownRequestMappingException } from '../../errors/exceptions';
import { ExpressAdapter } from '../adapters';
import { getRouteMappedMessage, RouterMethodFactory } from '../helpers';
import { RouterProxy, RouterProxyCallback } from './proxy';

/**
 * Defines a Route path properties.
 */
export interface RoutePathProperties {
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
  private readonly logger = new LoggerService(RouterBuilder.name);
  private readonly factory = new RouterMethodFactory();

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
  build(instance: Controller, prototype: MetaType<Controller>) {
    const router = (this.adapter as any).createRouter();
    const path = RouterBuilder.fetchControllerPath(prototype);
    const paths = this.scanForPaths(instance);

    this.applyPathsToRouterProxy(router, paths);

    return {
      path,
      router,
    };
  }

  /**
   * Applies given paths to a router proxy.
   *
   * @param router Express Router instance to be used.
   * @param paths Path property to be applied.
   */
  applyPathsToRouterProxy(router: Router, paths: RoutePathProperties[]): void {
    (paths || []).forEach((path) => {
      this.bindMethodToRouterProxy(router, path);
    });
  }

  /**
   * Bind a method to given router as proxy.
   *
   * @param router Express Router instance to be used.
   * @param pathProperties Path property to be bind.
   */
  bindMethodToRouterProxy(router: Router, pathProperties: RoutePathProperties): void {
    const {
      path,
      method,
      callback,
    } = pathProperties;

    const routerMethod = this.factory.get(router, method).bind(router);
    const proxy = this.proxy.create(callback);

    routerMethod(path, proxy);

    this.logger.log(getRouteMappedMessage(path, method));
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
      .filter((method: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, method);
        if (descriptor.set || descriptor.get) {
          return false;
        }

        return !isConstructor(method) && isFunction(prototype[method]);
      })
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

    const routePath = Reflect.getMetadata(PATH_METADATA, callback);
    if (isUndefined(routePath)) {
      return null;
    }

    const requestMethod: RequestMethod = Reflect.getMetadata(METHOD_METADATA, callback);

    return {
      callback: (<Function>callback).bind(instance),
      path: RouterBuilder.validateRoutePath(routePath),
      method: requestMethod,
    };
  }

  /**
   * Fetch the path for given router.
   *
   * @param prototype Router prototype function.
   *
   * @returns The router path requested.
   */
  private static fetchControllerPath(prototype: MetaType<Controller>): string {
    const path = Reflect.getMetadata(PATH_METADATA, prototype);

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
    if (isUndefined(path)) {
      throw new UnknownRequestMappingException();
    }

    return validatePath(path);
  }
}
