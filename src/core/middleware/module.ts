import 'reflect-metadata';

import { Express } from 'express';

import { ModuleContainer } from '../container';
import { MiddlewareResolver } from './resolver';
import { MiddlewareContainer } from './container';
import { ControllerProps, IModule } from '../interfaces';
import { IMiddleware, MiddlewareBuilder } from './builder';

export class MiddlewareModule {
  private static readonly container: MiddlewareContainer = new MiddlewareContainer();
  private static resolver: MiddlewareResolver;

  /**
   * Setup middleware module.
   *
   * @param {ModuleContainer} container Module container.
   */
  public static setup(container: ModuleContainer): void {
    this.resolver = new MiddlewareResolver(this.container, container);

    container.getModules().forEach((target) => {
      this.load(target.instance);
      this.resolver.resolve(target);
    });
  }

  public static setupMiddlewares(app: Express): void {
    this.container
      .getConfigurations()
      .forEach((configuration) => {
        configuration.forRoutes.forEach((route: ControllerProps) => {
          const path = route.path;

          (<IMiddleware[]>configuration.middlewares).forEach((target) => {
            const middlewares = this.container.getMiddlewares();
            const middleware = middlewares.get(target);

            if (!middleware) {
              throw new Error('Runtime error. Middleware not found!');
            }

            app.use(path, middleware.resolve());
          });

        });
      });
  }

  private static load(target: IModule) {
    if (!target['configure']) {
      return;
    }

    const builder = (<any>target).configure(new MiddlewareBuilder());
    if (builder) {
      this.container.add(builder.build());
    }
  }
}
