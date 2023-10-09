import 'reflect-metadata';

import { ErrorRequestHandler, RequestHandler, Router } from 'express';

import { IController } from './interfaces';
import { RequestMethod } from './enums';

/**
 * Controller Path Builder.
 */
export class RouterBuilder {
  constructor(private readonly factory: Function) {}

  /**
   * Build the controller path.
   *
   * @param {IController} target Instance where the path will be configured.
   * @param {IController} prototype Object type for instance.
   */
  public build(target: IController, prototype: IController): { path: string, router: Function } {
    const router = this.factory();
    const path = this.fetchControllerPath(prototype);
    const paths = this.scanControllerPaths(target);

    this.apply(router, paths);

    return { path, router };
  }

  private fetchControllerPath(target: IController) {
    const path = Reflect.getMetadata('path', target);

    return this.validateControllerPath(path);
  }

  private scanControllerPaths(target: IController) {
    const paths: ControllerPathProperties[] = [];

    const prototype = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(prototype)
      .filter((method) => method !== 'constructor');

    for (const method of methods) {
      const controllerPath = this.exploreMethodMetadata(target, prototype, method);
      if (controllerPath) {
        paths.push(controllerPath);
      }
    }

    return paths;
  }

  private exploreMethodMetadata(
    target: IController,
    prototype: any,
    methodName: string,
  ): ControllerPathProperties {
    const methodHandler: RequestHandler | ErrorRequestHandler = prototype[methodName];

    let path: string = Reflect.getMetadata('path', methodHandler);
    if (!path) {
      return;
    }

    path = this.validateControllerPath(path);
    const method: RequestMethod = Reflect.getMetadata('method', methodHandler);

    return {
      path,
      method,
      callback: (methodHandler as Function).bind(target),
    };
  }

  private apply(router: Router, paths: ControllerPathProperties[]) {
    (paths ?? []).forEach((pathProperties) => {
      this.bindMethodToRouter(router, pathProperties);
    });
  }

  private bindMethodToRouter(router: Router, pathProperties: ControllerPathProperties) {
    const { path, method, callback } = pathProperties;

    const routerMethod = this.getRequestMethod(router, method);

    routerMethod(path, callback);
  }

  private getRequestMethod(router: Router, method: RequestMethod) {
    switch (method) {
      case RequestMethod.POST:
        return router.post.bind(router);
      default:
        return router.get.bind(router);
    }
  }

  private validateControllerPath(path: string): string {
    if (!path) {
      throw new Error('Path not defined in @Path() annotation!');
    }

    return (path.charAt(0) !== '/') ? '/' + path : path;
  }
}

interface ControllerPathProperties {
  path: string;
  method: RequestMethod;
  callback: RequestHandler | ErrorRequestHandler | any;
}
