import { ApplicationMode, LoggerService } from '../../common';
import { Injector, Module } from '../injector';
import { MiddlewareContainer, MiddlewareWrapper } from './container';
import { MiddlewareMetaType } from './interfaces';
import { getMiddlewareInitMessage } from '../helpers';

/**
 * Resolves middleware instances.
 */
export class MiddlewareResolver {
  private readonly logger = new LoggerService(MiddlewareResolver.name);
  private injector = new Injector();
  /**
   * Creates a new instance of the MiddlewareResolver class.
   *
   * @param {MiddlewareContainer} container Middleware container.
   * @param {ApplicationMode} mode Application execution mode.
   */
  constructor(
    private readonly container: MiddlewareContainer,
    private readonly mode: ApplicationMode = ApplicationMode.RUN,
  ) {}

  /**
   * Resolves middleware instances.
   *
   * @param {Module} parent Parent
   * @param {string} parentName Module prototype.
   */
  public resolve(parent: Module, parentName: string) {
    const middlewares = this.container.getMiddlewares(parentName);

    middlewares.forEach(({ metaType }) => {
      this.resolveMiddlewareInstance(metaType, middlewares, parent);

      if (this.mode === ApplicationMode.RUN) {
        this.logger.log(getMiddlewareInitMessage(
          metaType.name,
          parent.metaType.name,
        ));
      }
    });
  }

  private resolveMiddlewareInstance(
    metaType: MiddlewareMetaType,
    middlewares: Map<string, MiddlewareWrapper>,
    parent: Module,
  ): void {
    this.injector.loadInstanceOfMiddleware(
      metaType,
      middlewares,
      parent,
    );
  }
}
