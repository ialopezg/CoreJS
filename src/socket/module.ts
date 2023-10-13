import 'reflect-metadata';

import { ModuleContainer, InstanceWrapper } from '../core/injector';
import { IInjectable } from '../common/interfaces';
import { SubjectsController } from './controller';
import { SocketContainer } from './container';
import { IGateway } from './interfaces';
import { SocketServerProvider } from './provider';
import { GATEWAY_METADATA } from './constants';

/**
 * Represents a module that could listen to gateway services.
 */
export class SocketModule {
  private static container = new SocketContainer();
  private static controller: SubjectsController;

  /**
   * Configure the Socket Module for gateway services.
   *
   * @param {SocketContainer} container Container for Observable Socket Servers.
   */
  public static setup(container: ModuleContainer) {
    this.controller = new SubjectsController(new SocketServerProvider(this.container));

    container.getModules().forEach(
      ({ components }) => this.hookGatewaysIntoServers(components),
    );
  }

  private static hookGatewaysIntoServers(components: Map<string, InstanceWrapper<IInjectable>>): void {
    components.forEach(({ instance, metaType }) => {
      const keys = Reflect.getMetadataKeys(metaType);
      if (!keys.includes(GATEWAY_METADATA)) {
        return;
      }

      this.controller.hookGateway(<IGateway>instance, metaType);
    });
  }
}
