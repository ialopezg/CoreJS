import { isFunction, isNil } from '@ialopezg/commonjs';

import {
  Controller,
  Injectable,
  IModule,
  MetaType,
  ModuleMetaType,
} from '../../common/interfaces';
import { UnknownExportableComponentException } from '../../errors';
import { InstanceWrapper } from './container';
import { ModuleRef } from './module-ref';

/**
 * Custom User component.
 */
export type CustomComponent = { provide: any };
/**
 * Custom User class.
 */
export type CustomClass = CustomComponent & { useClass: MetaType<any> };
/**
 * Custom User factory.
 */
export type CustomFactory = CustomComponent & { useFactory: Function, inject?: MetaType<any>[] };
/**
 * Custom User value.
 */
export type CustomValue = CustomComponent & { useValue: any };
/**
 * Component meta-type.
 */
export type ComponentMetaType = MetaType<Injectable> | CustomFactory | CustomValue | CustomClass;

/**
 * Represents a set of code encapsulated to be injected into an application.
 */
export class Module {
  private _instance: IModule;
  private _modules = new Set<Module>();
  private _components = new Map<any, InstanceWrapper<Injectable>>();
  private _controllers = new Map<string, InstanceWrapper<Controller>>();
  private _exports = new Set<string>();

  /**
   * Creates a new instance of the Module class.
   *
   * @param {ModuleMetaType} _metaType Module meta-type information.
   */
  constructor(private _metaType: ModuleMetaType) {
    this._instance = new _metaType();
    this.addModuleRef();
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
  get components(): Map<string, InstanceWrapper<Injectable>> {
    return this._components;
  }

  /**
   * Gets current controller objects.
   */
  get controllers(): Map<string, InstanceWrapper<Controller>> {
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
   * @param {MetaType<Injectable>} target Exportable component.
   */
  public addExportedComponent(target: MetaType<Injectable>): void {
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
   * @param {MetaType<Injectable> & { provide?: any, useValue?: any }} target Component to be registered.
   */
  public addComponent(target: ComponentMetaType): void {
    if (!isNil((<CustomComponent>target).provide)) {
      return this.addCustomComponent(target);
    }

    this._components.set((<MetaType<Injectable>>target).name, {
      name: (<MetaType<Injectable>>target).name,
      metaType: <MetaType<Injectable>>target,
      instance: null,
      resolved: false,
    });
  }

  /**
   * Registers the given object as a controller.
   *
   * @param {MetaType<Controller>} target Controller to be registered.
   */
  public addController(target: MetaType<Controller>): void {
    this._controllers.set(target.name, {
      name: (<MetaType<Controller>>target).name,
      metaType: target,
      instance: null,
      resolved: false,
    });
  }

  private addCustomClass(target: CustomClass): void {
    const { provide: metaType, useClass } = target;
    this._components.set(metaType.name, {
      name: metaType.name,
      metaType: useClass,
      instance: null,
      resolved: false,
    });
  }

  private addCustomComponent(target: ComponentMetaType,): void {
    if ((<CustomClass>target).useClass) {
      return this.addCustomClass(<CustomClass>target);
    } else if ((<CustomValue>target).useValue) {
      return this.addCustomValue(<CustomValue>target);
    } else if ((<CustomFactory>target).useFactory) {
      this.addCustomFactory(<CustomFactory>target);
    }
  }

  private addCustomFactory(target: CustomFactory): void {
    const { provide: name, useFactory: factory, inject } = target;
    this._components.set(name, {
      name,
      metaType: <any>factory,
      instance: null,
      resolved: false,
      inject: inject ?? [],
      isNotMetaType: true,
    });
  }

  private addCustomValue(target: CustomValue): void {
    const { provide, useValue: instance } = target;
    const name = isFunction(provide) ? provide.name : provide;
    this._components.set(name, {
      name,
      metaType: null,
      instance,
      resolved: true,
      isNotMetaType: true,
    });
  }

  private addModuleRef() {
    const moduleRef = this.getModuleRefMetaType(this._components);
    this._components.set(ModuleRef.name, {
      name: ModuleRef.name,
      metaType: ModuleRef,
      instance: new moduleRef(),
      resolved: true,
    });
  }

  private getModuleRefMetaType(components: Map<any, InstanceWrapper<Injectable>>): any {
    return class extends this._metaType {
      private readonly components = components;

      get<T>(type: string | symbol | object | MetaType<any>): T {
        const name = isFunction(type) ? (<MetaType<any>>type).name : type;
        const exists = this.components.has(name);

        return exists ? <T>this.components.get(name).instance : null;
      }
    }
  }
}
