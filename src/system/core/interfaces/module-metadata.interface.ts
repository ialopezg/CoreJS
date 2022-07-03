import { AppModule } from './app-module.interface';
import { Controller } from './controller.interface';

/**
 * Metadata information for a @Module anotation.
 */
export interface ModuleMetadata {
  /**
   * Child module list.
   */
  modules?: AppModule[];
  /**
   * Component list.
   */
  components?: any[];
  /**
   * Controller list
   */
  controllers?: Controller[];
  /**
   * Exported component list.
   */
  exports?: any[];
}
