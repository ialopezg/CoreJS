import { AppModule } from '../index';
import { Controller } from './controller.interface';
import { Injectable } from './injectable.interface';

/**
 * Metadata information for a @Module anotation.
 */
export interface ModuleMetadata {
  /**
   * Child module list.
   */
  modules?: (AppModule | any)[];
  /**
   * Component list.
   */
  components?: Injectable[];
  /**
   * Controller list
   */
  controllers?: Controller[];
  /**
   * Exported component list.
   */
  exports?: Injectable[];
}
