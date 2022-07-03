import { Express } from 'express';

import { AppContainer, ModuleDependency } from '../container';
import { AppModule, ControllerMetadata } from '../interfaces';
import {
  MiddlewareBuilder,
  MiddlewareConfiguration,
  Middleware,
} from './builder';
import { MiddlewareContainer } from './container';
import { MiddlewaresResolver } from './resolver';

export class MiddlewaresModule {
  private static container = new MiddlewareContainer();
  private static resolver: MiddlewaresResolver;

  /**
   * Setup middlewares for all registered modules if configuration was provided.
   *
   * @param container Modules container.
   */
  static setup(container: AppContainer) {
    const modules = container.getModules();

    this.resolver = new MiddlewaresResolver(this.container, container);

    modules.forEach((module: ModuleDependency) => {
      const { instance } = module;

      this.loadConfiguration(instance);
      this.resolver.resolveInstance(module);
    });
  }

  /**
   * Setup middlewares on given express application.
   *
   * @param app Express instance.
   */
  static setupMiddlewares(app: Express) {
    const configs = this.container.getConfigs();

    configs.map((config: MiddlewareConfiguration) => {
      config.forRoutes.map((route: ControllerMetadata) => {
        const path = route.path;

        (<Middleware[]>config.middlewares).map((target: Middleware) => {
          const middlewares = this.container.getMiddlewares();
          const middleware = middlewares.get(target);

          if (!middleware) {
            throw new Error('Runtime error!');
          }

          app.use(path, middleware.resolve());
        });
      });
    });
  }

  /**
   * Load middleware configuration for given parent module.
   *
   * @param parent Parent module.
   *
   * @returns Requested middleware configuration.
   */
  private static loadConfiguration(parent: AppModule | any) {
    if (!parent['configure']) {
      return;
    }

    const builder: MiddlewareBuilder = parent.configure(
      new MiddlewareBuilder(),
    );
    if (builder) {
      this.container.addConfig(builder.build());
    }
  }
}
