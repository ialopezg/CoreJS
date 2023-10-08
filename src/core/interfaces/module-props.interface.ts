import { IModule } from './module.interface';
import { IController } from './controller.interface';
import { IComponent } from './component.interface';

/**
 * Module property definitions.
 */
export interface ModuleProps {
  /**
   * Sub modules.
   */
  modules?: IModule[];
  /**
   * Services or components.
   */
  components?: IComponent[];
  /**
   * Routes.
   */
  controllers?: IController[];
}
