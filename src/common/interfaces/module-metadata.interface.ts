import { IModule } from './module.interface';
import { IController } from './controller.interface';
import { IInjectable } from './injectable.interface';

/**
 * Module metadata definition.
 */
export interface ModuleMetadata {
  /**
   * Child modules.
   */
  modules?: (IModule | any)[];
  /**
   * Components.
   */
  components?: IInjectable[];
  /**
   * Controllers.
   */
  controllers?: IController[];
  /**
   * Shareable components.
   */
  exports?: IInjectable[];
}
