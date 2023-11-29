import { ListenerController } from './controller';
import { InstanceWrapper, ModuleContainer } from '../core/injector';
import { Controller } from '../common/interfaces';
import { Server } from './server';

/**
 * Represents the microservice module.
 */
export class MicroserviceModule {
  private static readonly controller = new ListenerController();

  /**
   * Register the microservice clients.
   *
   * @param {ModuleContainer} container Module container.
   */
  public static setupClients(container: ModuleContainer): void {
    const modules = container.getModules();

    modules.forEach(({ controllers, components }) => {
      this.bindClients(controllers);
      this.bindClients(components);
    });
  }

  /**
   * Register the microservice listener in the given server.
   *
   * @param {ModuleContainer} container Module container.
   * @param {Server} server Server instance.
   */
  public static setupListeners(container: ModuleContainer, server: Server): void {
    const modules = container.getModules();

    modules.forEach((
      { controllers},
    ) => this.bindListeners(controllers, server));
  }

  private static bindClients(
    controllers: Map<string, InstanceWrapper<Controller>>,
  ): void {
    controllers.forEach(({ instance }) => {
      this.controller.bindClients(instance);
    });
  }

  private static bindListeners(
    controllers: Map<string, InstanceWrapper<Controller>>,
    server: Server,
  ): void {
    controllers.forEach(({ instance }) => {
      this.controller.bindHandlers(instance, server);
    });
  }
}
