import { IController, IInjectable } from '../../common/interfaces';
import {
  CircularDependencyException,
  RuntimeException,
  UnknownDependenciesException,
} from '../../errors';
import { IMiddleware, IMiddlewareProto } from '../middleware';
import { InstanceWrapper, ModuleDependencies } from './container';

/**
 * Creates all the dependency instances and injects them into the main application.
 */
export class Injector {
  /**
   * Creates a new object, using an existing object as the prototype of the newly created object.
   *
   * @param prototype Existent prototype.
   * @param collection Collection that contains the prototype.
   */
  public loadPrototypeOfInstance<T>(
    prototype: T,
    collection: Map<T, InstanceWrapper<T>>,
  ): void {
    if (!collection) {
      return;
    }

    collection.set(prototype, {
      ...collection.get(prototype),
      instance: Object.create((<any>prototype).prototype),
    });
  }

  /**
   * Loads the instance of given component.
   *
   * @param {IInjectable} component Component object to be loaded.
   * @param {ModuleDependencies} parent Parent module.
   */
  public loadInstanceOfComponent(
    component: IInjectable,
    parent: ModuleDependencies,
  ) {
    this.loadInstance(component, parent.components, parent);
  }

  /**
   * Loads the instance of given component.
   *
   * @param {IInjectable} controller Component object to be loaded.
   * @param {ModuleDependencies} parent Parent module.
   */
  public loadInstanceOfController(
    controller: IController,
    parent: ModuleDependencies,
  ) {
    this.loadInstance(controller, parent.controllers, parent);
  }

  /**
   * Loads the instance of given component.
   *
   * @param {IInjectable} prototype Component object to be loaded.
   * @param {Map<IMiddlewareProto, IMiddleware>} collection Middlewares.
   * @param {ModuleDependencies} parent Parent module.
   */
  public loadInstanceOfMiddleware(
    prototype: IMiddlewareProto,
    collection: Map<IMiddlewareProto, IMiddleware>,
    parent: ModuleDependencies,
  ) {
    const fetchedInstance = collection.get(prototype);

    if (!fetchedInstance) {
      this.resolveConstructorParams(prototype, parent, (args: IInjectable[]) => {
        collection.set(prototype, new (<any>prototype)(...args));
      });
    }
  }

  private loadInstance<T>(prototype: T, collection: Map<T, InstanceWrapper<T>>, parent: ModuleDependencies): void {
    const fetchedInstance = collection.get(prototype);
    if (typeof fetchedInstance === 'undefined') {
      throw new RuntimeException();
    }

    if (!fetchedInstance.resolved) {
      this.resolveConstructorParams(prototype, parent, (args) => {
        fetchedInstance.instance = Object.assign(
          fetchedInstance.instance,
          new (<any>prototype)(...args),
        );
        fetchedInstance.resolved = true;
      });
    }
  }

  private resolveConstructorParams<T>(
    prototype: T,
    parent: ModuleDependencies,
    callback: (args: IInjectable[]) => void,
  ): void {
    let params = Reflect.getMetadata('design:paramtypes', prototype) ?? [];

    if ((<any>prototype).dependencies) {
      params = (<any>prototype).dependencies;
    }

    callback(params.map(
      (param: any) => this.resolveSingleParam(prototype, param, parent)),
    );
  }

  private resolveSingleParam<T>(prototype: T, param: T, parent: ModuleDependencies) {
    if (typeof param === 'undefined') {
      throw new CircularDependencyException((<any>prototype).name);
    }

    return this.resolveComponentInstance(parent, param, prototype);
  }

  private resolveComponentInstance<T>(
    parent: ModuleDependencies,
    param: T,
    prototype: T,
  ): IInjectable {
    const wrapper = this.scanForComponent(
      parent.components,
      param,
      parent,
      prototype,
    );

    if (!wrapper.instance) {
      this.loadInstanceOfComponent(param, parent);
    }

    return wrapper.instance;
  }

  private scanForComponent<T>(
    components: Map<IInjectable, InstanceWrapper<IInjectable>>,
    param: T,
    parent: ModuleDependencies,
    component: T,
  ): InstanceWrapper<IInjectable> {
    if (!components.has(param)) {
      const wrapper = this.scanComponentInChildModules(parent, param);

      if (!wrapper) {
        throw new UnknownDependenciesException((<any>component).name);
      }

      return wrapper;
    }

    return components.get(param);
  }

  private scanComponentInChildModules<T>(
    parent: ModuleDependencies,
    component: T,
  ): InstanceWrapper<IInjectable> {
    let wrapper: InstanceWrapper<IInjectable>;

    parent.modules.forEach((child) => {
      if (!child.exports.has(component) || !child.components.has(component)) {
        return;
      }

      wrapper = child.components.get(component);
      if (!wrapper.resolved) {
        this.loadInstanceOfComponent(component, child);
      }
    });

    return wrapper;
  }
}
