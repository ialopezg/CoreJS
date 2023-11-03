import {
  IController,
  IInjectable,
  IModule,
  MetaType,
  ModuleMetaType,
} from '../../common/interfaces';
import { UnknownExportableComponentException } from '../../errors';
import { InstanceWrapper } from './container';

/**
 * Represents a set of code encapsulated to be injected into an application.
 */
export class Module {
  private _instance: IModule;
  private _modules = new Set<Module>();
  private _components = new Map<string, InstanceWrapper<IInjectable>>();
  private _controllers = new Map<string, InstanceWrapper<IController>>();
  private _exports = new Set<string>();

  /**
   * Creates a new instance of the Module class.
   *
   * @param {ModuleMetaType} _metaType Module meta-type information.
   */
  constructor(private _metaType: ModuleMetaType) {
    this._instance = new _metaType();
  }

  /**
   * Gets current exportable component objects.
   */
  get exports(): Set<string> {
    return this._exports;
  }

  /**
   * Gets current component objects.
   */
  get components(): Map<string, InstanceWrapper<IInjectable>> {
    return this._components;
  }

  /**
   * Gets current controller objects.
   */
  get controllers(): Map<string, InstanceWrapper<IController>> {
    return this._controllers;
  }

  /**
   * Gets current module instance.
   */
  get instance(): IModule {
    return this._instance;
  }

  /**
   * Gets current module meta-type data.
   */
  get metaType(): ModuleMetaType {
    return this._metaType;
  }

  /**
   * Gets current child modules.
   */
  get modules(): Set<Module> {
    return this._modules;
  }

  set instance(value: IModule) {
    this._instance = value;
  }

  /**
   * Registers the given object as an exportable component. If component does not exist,
   * will throw an UnknownExportableComponentException object.
   *
   * @param {MetaType<IInjectable>} target Exportable component.
   */
  public addExportedComponent(target: MetaType<IInjectable>): void {
    if (!this._components.has(target.name)) {
      throw new UnknownExportableComponentException(target.name);
    }

    this._exports.add(target.name);
  }

  /**
   * Registers the given object as a child module.
   *
   * @param {Module} child Child module.
   */
  public addChildModule(child: Module): void {
    this.modules.add(child);
  }

  /**
   * Registers the given object as a component.
   *
   * @param {MetaType<IInjectable> & { provide?: any, useValue?: any }} target Component to be registered.
   */
  public addComponent(
    target: MetaType<IInjectable> & { provide?: any, useValue?: any },
  ): void {
    if (target.provide && target.useValue) {
      return this.addProvider(target);
    }

    this._components.set(target.name, {
      instance: null,
      metaType: target,
      resolved: false,
    });
  }

  /**
   * Registers the given object as a controller.
   *
   * @param {MetaType<IController>} target Controller to be registered.
   */
  public addController(target: MetaType<IController>): void {
    this._controllers.set(target.name, {
      instance: null,
      metaType: target,
      resolved: false,
    });
  }

  /**
   * Registers the given object as a provider.
   *
   * @param {MetaType<IInjectable> & { provide?: any, useValue?: any }} target Provider to be registered.
   */
  public addProvider(
    target: MetaType<IInjectable> & { provide?: any, useValue?: any },
  ): void {
    const { provide: type, useValue: value } = target;
    this._components.set(type.name, {
      instance: value,
      metaType: type,
      resolved: true,
    });
  }
}
