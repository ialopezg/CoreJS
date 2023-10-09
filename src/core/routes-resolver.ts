import { Application, Express } from 'express';

import { ModuleContainer, IInstanceWrapper } from './container';
import { IController } from './interfaces';
import { RouterBuilder } from './router-builder';

/**
 * Routes resolver.
 */
export class RoutesResolver {
  private readonly builder: RouterBuilder;

  /**
   * Creates a new instance of RoutesResolver class.
   *
   * @param {ModuleContainer} container Container for modules.
   * @param {Function} factory Router factory.
   */
  constructor(
    private readonly container: ModuleContainer,
    private readonly factory: Function,
  ) {
    this.builder = new RouterBuilder(factory);
  }

  /**
   * Resolve router and routes from controller objects.
   *
   * @param {Express} expressInstance Express application.
   */
  public resolve(expressInstance: Express): void {
    this.container.getModules()
      .forEach(({ controllers }) => {
        this.resolveControllers(controllers, expressInstance)
      });
  }

  private resolveControllers(
    controllers: Map<IController, IInstanceWrapper<IController>>,
    expressInstance: Express,
  ): void {
    controllers.forEach(({ instance }, controller) => {
      const { path, router } = this.builder.build(instance, controller);

      expressInstance.use(path, router as Application);
    });
  }
}
