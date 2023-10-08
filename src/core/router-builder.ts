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

    let path = Reflect.getMetadata('path', prototype);
    path = this.validatePath(path);

    const paths = this.scan(target);
    this.apply(router, paths);

    return { path, router };
  }

  private validatePath(path: string): string {
    if (!path) {
      throw new Error('Path not defined in @Path() annotation!');
    }

    if (path.charAt(0) !== '/') {
      return `/${path}`;
    }

    return path;
  }

  private scan(target: IController) {
    const paths: ControllerPathProperties[] = [];

    const prototype = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(prototype)
      .filter((method) => method !== 'constructor');

    for (const method of methods) {
      const controllerPath = this.getPath(target, prototype, method);
      if (controllerPath) {
        paths.push(controllerPath);
      }
    }

    return paths;
  }

  private getPath(
    target: IController,
    prototype: any,
    methodName: string,
  ): ControllerPathProperties {
    const methodHandler: RequestHandler | ErrorRequestHandler = prototype[methodName];

    let path: string = Reflect.getMetadata('path', methodHandler);
    if (!path) {
      return;
    }

    path = this.validatePath(path);
    const method: RequestMethod = Reflect.getMetadata('method', methodHandler);

    return {
      path,
      method,
      callback: (methodHandler as Function).bind(target),
    };
  }

  private apply(router: Router, paths: ControllerPathProperties[]) {
    (paths ?? []).map((pathProperties) => {
      const { path, method, callback } = pathProperties;

      switch (method) {
        case RequestMethod.GET:
          router.get(path, callback);
          break;
      }
    });
  }
}

interface ControllerPathProperties {
  path: string;
  method: RequestMethod;
  callback: RequestHandler | ErrorRequestHandler;
}
