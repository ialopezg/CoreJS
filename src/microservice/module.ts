import { Controller } from '../common/interfaces';
import { Container, InstanceWrapper } from '../core/injector';
import { Module } from '../core/injector/module';
import { ListenersController } from './controller';
import { Server } from './server';

/**
 * Microservice module.
 */
export class MicroservicesModule {
  private static readonly controller = new ListenersController();

  /**
   * Setup module clients and listeners.
   *
   * @param container Modules container.
   */
  static setupClients(container: Container): void {
    container.getModules().forEach(({ components, controllers }) => {
      this.bindClients(controllers);
      this.bindClients(components);
    });
  }

  /**
   * Setup controller listeners.
   *
   * @param container Modules container.
   * @param server Server instance where listeners will be bound.
   */
  static setupListeners(container: Container, server: Server): void {
    container
      .getModules()
      .forEach(({ controllers }: Module) =>
        this.bindListeners(controllers, server),
      );
  }

  /**
   * Bind client instances.
   *
   * @param collection Collection to be analyzed.
   */
  static bindClients(collection: Map<string, InstanceWrapper<Controller>>) {
    collection.forEach(({ instance }) => {
      this.controller.bindClientToProperties(instance);
    });
  }

  /**
   * Bind listeners to controllers.
   *
   * @param controllers Controller to be bound.
   * @param server Server intance where listeners will be bound.
   */
  static bindListeners(
    controllers: Map<string, InstanceWrapper<Controller>>,
    server: Server,
  ): void {
    controllers.forEach(({ instance }) => {
      this.controller.bindPatternHandlers(instance, server);
    });
  }
}
