import 'reflect-metadata';

import { ErrorRequestHandler, RequestHandler, Router } from 'express';

import { RequestMethod } from './enums';
import { Controller } from './interfaces';
import { validatePath } from '../../common';

export class RouterBuilder {
  constructor(private readonly routerFactory: Function) {}

  build(instance: Controller, route: Function) {
    const router = this.routerFactory();

    let path = RouterBuilder.validatePath(Reflect.getMetadata('path', route));
    const routes = RouterBuilder.scanForPaths(instance);
    this.applyPathsToRouter(router, routes);

    return { path, router };
  }

  private static validatePath(path: string): string {
    if (!path) {
      throw new Error('Path not defined in @RequestMapping() annotation!');
    }

    return validatePath(path);
  }

  private static scanForPaths(instance: Controller) {
    const routePathProperties: RoutePathProperties[] = [];

    const prototype = Object.getPrototypeOf(instance);
    const methodList = Object.getOwnPropertyNames(prototype).filter(
      (method: string) => method !== 'constructor',
    );

    for (const methodName of methodList) {
      const routePath = RouterBuilder.exploreMethodMetadata(
        instance,
        prototype,
        methodName,
      );
      if (routePath) {
        routePathProperties.push(routePath);
      }
    }

    return routePathProperties;
  }

  private static exploreMethodMetadata(
    instance: Controller,
    prototype: any,
    methodName: string,
  ): RoutePathProperties | any {
    const method: RequestHandler | ErrorRequestHandler = prototype[methodName];

    let path: string = Reflect.getMetadata('path', method);
    if (!path) {
      return null;
    }

    path = RouterBuilder.validatePath(path);
    const requestMethod: RequestMethod = Reflect.getMetadata('method', method);

    return {
      path,
      method: requestMethod,
      callback: (method as Function).bind(instance),
    };
  }

  private applyPathsToRouter(
    router: Router,
    routePaths: RoutePathProperties[],
  ) {
    (routePaths || []).map((routePathProperties: RoutePathProperties) => {
      const { path, method, callback } = routePathProperties;

      switch (method) {
        case RequestMethod.GET:
          router.get(path, callback);
          break;
      }
    });
  }
}

interface RoutePathProperties {
  path: string;
  method: RequestMethod;
  callback: RequestHandler | ErrorRequestHandler;
}
