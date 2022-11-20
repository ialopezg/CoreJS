import { Controller } from './controller.interface';
import { Injectable } from './injectable.interface';
import { Module } from './module.interface';

/**
 * Metadata information for a @Module annotation.
 */
export interface ModuleMetadata {
  /**
   * Child module list.
   */
  modules?: (Module | any)[];
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
