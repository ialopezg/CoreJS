import 'reflect-metadata';

import { Component, Controller } from './interfaces';
import { InstanceWrapper, ModuleDependency } from './container';
import { Middleware } from './middlewares/builder';

/**
 * Objects Instance Loader.
 */
export class AppInstanceLoader {
  /**
   * Loads a component instance if properly registered in given parent module.
   *
   * @param target Requested controller.
   * @param parent Parent module.
   */
  loadInstanceOfComponent(target: Component | any, parent: ModuleDependency) {
    const { components } = parent;
    const component = components.get(target);

    if (component.instance === null) {
      const args: any[] = [];
      // Get components passed as constructor parameter in components
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param: any) => {
        if (typeof param === 'undefined') {
          const message =
            `Can't create instance of ${target.name}` +
            '. It is possible that you are trying to do circular-dependency A->B, B->A.';

          throw new Error(message);
        }

        const instance = this.resolveComponentInstance(parent, param, target);
        args.push(instance);
      });

      component.instance = new target(...args);
    }
  }

  /**
   * Loads a Controller instance if properly registered on given parent module.
   *
   * @param target Requested controller.
   * @param parent Parent module.
   */
  loadInstanceOfController(target: Controller | any, parent: ModuleDependency) {
    const { controllers } = parent;
    const controller = controllers.get(target);

    if (controller.instance === null) {
      const args = [];
      // Get components passed as constructor in controllers
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param: any) => {
        if (typeof param === 'undefined') {
          const message =
            `Can't create instance of ${target}` +
            '. It is possible that you are trying to do circular-dependency A->B, B->A.';

          throw new Error(message);
        }

        const instance = this.resolveComponentInstance(parent, param, target);
        args.push(instance);
      });

      controller.instance = new target(...args);
    }
  }

  /**
   * Loads a Middleware instance if properly registered on given parent module..
   *
   * @param target Requested middleware.
   * @param middlewares Middlewares collection.
   * @param parent Parent module.
   */
  loadInstanceOfMiddleware(
    target: Middleware | any,
    middlewares: Map<Middleware, Middleware>,
    parent: ModuleDependency,
  ): void {
    const middleware = middlewares.get(target);

    if (middleware === null) {
      const args = [];
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param: any) => {
        if (typeof param === 'undefined') {
          const message =
            `Can't create instance of ${target}` +
            '. It is possible that you are trying to do circular-dependency A->B, B->A.';

          throw new Error(message);
        }

        const instance = this.resolveComponentInstance(parent, param, target);
        args.push(instance);
      });

      middlewares.set(target, new target(...args));
    }
  }

  /**
   * Search for a component instance in given parent module.
   *
   * @param parent Parent module.
   * @param param Requested component.
   * @param target Requesting component.
   *
   * @returns A Component instance if exists.
   */
  private resolveComponentInstance(
    parent: ModuleDependency,
    param: any,
    target: Component | Controller | any,
  ) {
    const { components } = parent;
    const instanceWrapper = this.scanForComponent(
      components,
      param,
      parent,
      target,
    );

    if (instanceWrapper.instance === null) {
      this.loadInstanceOfComponent(param, parent);
    }

    return instanceWrapper.instance;
  }

  /**
   * Search for an instance wrapper object in given components collection.
   *
   * @param components Components collection.
   * @param param Requested component.
   * @param parent Parent module.
   * @param target Requesting object.
   *
   * @returns An initialized InstanceWrapper object if exists.
   */
  private scanForComponent(
    components: Map<Component, InstanceWrapper<Component>>,
    param: any,
    parent: ModuleDependency,
    target: Component | Controller | any,
  ): InstanceWrapper<Component> {
    if (!components.has(param)) {
      const instanceWrapper = this.scanForComponentInSubModules(parent, param);

      if (instanceWrapper === null) {
        throw new Error(`Can't recognize dependencies of ${target.name}`);
      }

      return instanceWrapper;
    }

    return components.get(param);
  }

  /**
   * Search for an instance wrapper object in child modules of givent parent module.
   *
   * @param parent Parent module.
   * @param target Requested component.
   *
   * @returns An initialized InstanceWrapper object.
   */
  private scanForComponentInSubModules(
    parent: ModuleDependency,
    target: Component | Controller | any,
  ): InstanceWrapper<Component> {
    const { modules } = parent;
    let instanceWrapper: InstanceWrapper<Component> = null;

    modules.forEach((child: ModuleDependency) => {
      const { components, exports } = child;

      if (components.has(target) && exports.has(target)) {
        instanceWrapper = components.get(target);

        if (instanceWrapper.instance === null) {
          this.loadInstanceOfComponent(target, child);
        }
      }
    });

    return instanceWrapper;
  }
}
