import { IModule } from './module.interface';
import { Controller } from './controller.interface';
import { Injectable } from './injectable.interface';

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
  components?: Injectable[];
  /**
   * Controllers.
   */
  controllers?: Controller[];
  /**
   * Shareable components.
   */
  exports?: Injectable[];
}
