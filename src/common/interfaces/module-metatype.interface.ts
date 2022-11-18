import { Module } from './module.interface';
import { MetaType } from './metatype.interface';

/**
 * Defines a prototype with meta type information for AppModule objects.
 */
export interface ModuleMetaType extends MetaType<Module> {}
