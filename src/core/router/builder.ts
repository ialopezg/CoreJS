import { isConstructor, isUndefined } from '@ialopezg/commonjs';
import { Router } from 'express';

import { METHOD_METADATA, PATH_METADATA } from '../../common/constants';
import { IController, MetaType } from '../../common/interfaces';
import { ApplicationMode, LoggerService, RequestMethod, validatePath } from '../../common';
import { ExpressAdapter } from '../adapters';
import { UnknownRequestMappingException } from '../../errors';
import { getRouteMappedMessage, RouterMethodFactory } from '../helpers';
import { RouterProxy, RouterProxyCallback } from './proxy';

/**
 * Creates the router functions available in the whole application.
 */
export class RouterBuilder {
  private readonly logger = new LoggerService(RouterBuilder.name);
  private factory = new RouterMethodFactory();

  /**
   * Creates a new instance of RouterBuilder class.
   *
   * @param {RouterProxy} proxy Router proxy.
   * @param {ExpressAdapter} adapter Express application adapter.
   * @param {ApplicationMode} mode Application execution mode.
   */
  constructor(
    private readonly proxy?: RouterProxy,
    private readonly adapter?: ExpressAdapter,
    private readonly mode: ApplicationMode = ApplicationMode.RUN,
  ) {
  }

  /**
   * Builds the router function for given controller.
   *
   * @param {IController} target Controller.
   * @param {IController} metaType Controller type.
   */
  public build(
    target: IController,
    metaType: MetaType<IController>,
  ): { path: string, router: Router } {
    const router = (<any>this.adapter).createRouter();
    const path = this.fetchRouterPath(metaType);
    const paths = this.scanForPaths(target);

    this.apply(router, paths);

    return { path, router };
  }

  /**
   * Scans for a path from given controller type.
   *
   * @param {Controller} target Controller.
   * @param {Controller} prototype Controller type.
   */
  public scanForPathsFromPrototype(target: IController, prototype: any): RoutePathProperties[] {
    return Object.getOwnPropertyNames(prototype)
      .filter((property) => {
        const descriptor = Object.getOwnPropertyDescriptor(
          prototype,
          property,
        );
        if (descriptor.set || descriptor.get) {
          return false;
        }

        return !isConstructor(property);
      })
      .map(
        (property) => this.exploreMethodMetadata(
          target,
          prototype,
          property,
        ),
      )
      .filter(
        (property) => property !== null,
      );
  }

  public scanForPaths(controller: IController) {
    return this.scanForPathsFromPrototype(
      controller,
      Object.getPrototypeOf(controller),
    );
  }

  private apply(router: Router, paths: RoutePathProperties[]):void{
    (paths || []).map((route) => {
      this.bind(router, route);
    });
  }

  public bind(router: Router, pathProperties: RoutePathProperties): void {
    const { path, method, callback } = pathProperties;

    const routerMethod = this.factory.get(router, method).bind(router);
    const proxy = this.proxy.createProxy(callback);

    routerMethod(path, proxy);

    if (this.mode === ApplicationMode.RUN) {
      this.logger.log(getRouteMappedMessage(path, method));
    }
  }

  private exploreMethodMetadata(
    target: IController,
    prototype: any,
    methodName: string,
  ): RoutePathProperties {
    const callback = prototype[methodName];
    const path = Reflect.getMetadata(PATH_METADATA, callback);
    if (isUndefined(path)) {
      return null;
    }

    const method: RequestMethod = Reflect.getMetadata(
      METHOD_METADATA,
      callback,
    );

    return {
      path: this.validateRoutePath(path),
      method,
      callback: (<Function>callback).bind(target),
    };
  }

  private fetchRouterPath(target: MetaType<IController>): string {
    return this.validateRoutePath(Reflect.getMetadata(PATH_METADATA, target));
  }

  private validateRoutePath(path: string): string {
    if (isUndefined(path)) {
      throw new UnknownRequestMappingException();
    }

    return validatePath(path);
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
