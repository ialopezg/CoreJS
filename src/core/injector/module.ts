import { InstanceWrapper } from './container';
import { MetaType, Module as AppModule, ModuleMetaType, Injectable, Controller } from '../../common/interfaces';
import { UnknownExportException } from '../../errors/exceptions';

/**
 * Represents a application module.
 */
export class Module {
  private _instance: AppModule;
  private _modules = new Set<Module>();
  private _components = new Map<string, InstanceWrapper<Injectable>>();
  private _controllers = new Map<string, InstanceWrapper<Controller>>();
  private _exports = new Set<string>();

  /**
   * Creates a new instance of the class Module.
   *
   * @param _metaType MetaType to be implemented.
   */
  constructor(private _metaType: ModuleMetaType) {
    this._instance = new _metaType();
  }

  /**
   * Gets current modules.
   */
  get modules(): Set<Module> {
    return this._modules;
  }

  /**
   * Gets current components.
   */
  get components(): Map<string, InstanceWrapper<Injectable>> {
    return this._components;
  }

  /**
   * Gets current controllers.
   */
  get controllers(): Map<string, InstanceWrapper<Controller>> {
    return this._controllers;
  }

  /**
   * Gets current exported components.
   */
  get exports(): Set<string> {
    return this._exports;
  }

  /**
   * Gets current instance.
   */
  get instance(): AppModule {
    return this._instance;
  }

  /**
   * Sets current instance.
   */
  set instance(value: AppModule) {
    this._instance = value;
  }

  /**
   * Gets current MetaType
   */
  get metaType(): ModuleMetaType {
    return this._metaType;
  }

  /**
   * Adds a module as submodule.
   *
   * @param module Module to be added.
   */
  addSubModule(module: Module): void {
    this._modules.add(module);
  }

  /**
   * Adds a component or provider.
   *
   * @param component Component to be added.
   */
  addComponent(
    component: MetaType<Injectable> & { provide?: any, useValue?: any },
  ) {
    if (component.provide && component.useValue) {
      this.addProvider(component);
      return;
    }

    this._components.set(component.name, {
      metaType: component,
      instance: null,
      resolved: false,
    });
  }

  /**
   * Adds a provider.
   *
   * @param provider Provider to be added.
   */
  addProvider(provider: any) {
    const {
      provide: type,
      useValue: value,
    } = provider;
    this._components.set(type.name, {
      metaType: type,
      instance: value,
      resolved: true,
    });
  }

  /**
   * Adds a controller.
   *
   * @param controller Controller to be added.
   */
  addController(controller: MetaType<Controller>) {
    this._controllers.set(controller.name, {
      metaType: controller,
      instance: null,
      resolved: false,
    });
  }

  /**
   * Adds a component as exported object.
   *
   * @param component Component to be exported.
   */
  addExportedComponent(component: MetaType<Injectable>) {
    if (!this._components.get(component.name)) {
      throw new UnknownExportException(component.name);
    }
    this._exports.add(component.name);
  }
}
