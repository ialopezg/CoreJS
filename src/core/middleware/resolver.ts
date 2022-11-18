import { AppMode } from '../../common/enums';
import { LoggerService } from '../../common';
import { getMiddlewareInitMessage } from '../helpers';
import { Injector } from '../injector';
import { Module } from '../injector/module';
import { MiddlewareContainer, MiddlewareWrapper } from './container';
import { MiddlewareMetaType } from './interfaces';

/**
 * Represents an object that resolve middleware instances.
 */
export class MiddlewareResolver {
  private readonly logger = new LoggerService(MiddlewareResolver.name);
  private readonly injector = new Injector();

  /**
   * Creates a new instance of this app with given parameters.
   *
   * @param container Middleware container.
   * @param mode Application execution mode
   */
  constructor(
    private readonly container: MiddlewareContainer,
    private mode = AppMode.RUN,
  ) {
  }

  /**
   * Resolve a middleware instance for given module.
   *
   * @param target Module that contains the middleware configuration.
   * @param moduleName Middleware prototype to be resolved.
   */
  resolveInstances(target: Module, moduleName: string): void {
    const middlewares = this.container.getMiddlewares(moduleName);

    middlewares.forEach(({ metaType }) => {
      this.resolveMiddlewareInstance(metaType, middlewares, target);

      if (this.mode === AppMode.RUN) {
        this.logger.log(getMiddlewareInitMessage(metaType.name, target.metaType.name));
      }
    });
  }

  /**
   * Resolve a middleware instance for given middleware prototype.
   *
   * @param metaType Middleware prototype.
   * @param middlewares Middleware collection.
   * @param target Container Module.
   */
  private resolveMiddlewareInstance(
    metaType: MiddlewareMetaType,
    middlewares: Map<string, MiddlewareWrapper>,
    target: Module,
  ) {
    this.injector.loadInstanceOfMiddleware(
      metaType,
      middlewares,
      target,
    );
  }
}
