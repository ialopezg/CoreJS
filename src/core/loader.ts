import 'reflect-metadata';

import { IComponent, IController } from './interfaces';
import { IInstanceWrapper, IModuleDependencies } from './container';
import { IMiddleware } from './middleware/builder';

/**
 * Dependencies Instance Loader.
 */
export class InstanceLoader {
  /**
   * Load the instance of given component object.
   *
   * @param {IComponent} target Target component.
   * @param {IModuleDependencies} parent Parent module.
   */
  public loadComponentInstance(target, parent: IModuleDependencies) {
    const { components } = parent;
    const component = components.get(target);

    if(component.instance === null) {
      const argsInstances = [];
      const constructorParams = Reflect.getMetadata('design:paramtypes', target) || [];

      constructorParams.map((param) => {
        if (typeof param === "undefined") {
          const msg = `Can't create instance of ${target} `
            + `It is possible that you are trying to do circular-dependency A->B, B->A.`;

          throw new Error(msg);
        }

        const instance = this.resolveComponentInstance<IComponent>(parent, param, target);
        argsInstances.push(instance);
      });
      component.instance = new target(...argsInstances);
    }
  }

  /**
   * Load the instance of given controller object.
   *
   * @param {IController} target Target controller.
   * @param {IModuleDependencies} parent Parent module.
   */
  public loadInstanceOfController(
    target: IController,
    parent: IModuleDependencies,
  ): void {
    const { controllers } = parent;
    const controller = controllers.get(target);

    if (!controller.instance) {
      const args: IComponent[] = [];
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param) => {
        if (typeof param === 'undefined') {
          const message = `Can't create instance of ${target}. It is possible that you are trying to do a cycle-dependency A->B, B->A.`;

          throw new Error(message);
        }

        const instance = this.resolveComponentInstance<IController>(
          parent,
          param,
          target,
        );
        args.push(instance);
      });

      controller.instance = new (<any>target)(...args);
    }
  }

  /**
   * Load the instance of given middleware object.
   *
   * @param {IMiddleware} target Target middleware.
   * @param {Map<IMiddleware, IMiddleware>} middlewares Middleware collection.
   * @param {IModuleDependencies} parent Parent module.
   */
  public loadMiddlewareInstance(
    target: IMiddleware,
    middlewares: Map<IMiddleware, IMiddleware>,
    parent: IModuleDependencies,
  ): void {
    const middleware = middlewares.get(target);

    if (!middleware) {
      const args: IComponent[] = [];
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param) => {
        if (typeof param === 'undefined') {
          const message = `Can't create instance of ${target}. It is possible that you are trying to do a cycle-dependency A->B, B->A.`;

          throw new Error(message);
        }

        const instance = this.resolveComponentInstance<IMiddleware>(parent, param, target);
        args.push(instance);
      });

      middlewares.set(target, new (<any>target)(...args));
    }
  }

  private resolveComponentInstance<T>(
    parent: IModuleDependencies,
    param: IComponent,
    target: T,
  ): IComponent {
    const { components } = parent;
    const wrapper = this.scanForComponent(components, param, parent, target);

    if (!wrapper.instance) {
      this.loadComponentInstance(param, parent);
    }

    return wrapper.instance;
  }

  private scanForComponent(
    components: Map<IComponent, IInstanceWrapper<IComponent>>,
    param: IComponent,
    parent: IModuleDependencies,
    target: IComponent,
  ): IInstanceWrapper<IComponent> {
    let wrapper: IInstanceWrapper<IComponent>;
    if (!components.has(param)) {
      wrapper = this.scanForComponentInChildModules(parent, param);
      if (wrapper === null) {
        throw new Error(`Can't recognize dependencies of ${target}!`);
      }
    } else {
      wrapper = components.get(param);
    }

    return wrapper;
  }

  private scanForComponentInChildModules(
    parent: IModuleDependencies,
    target: IComponent,
  ): IInstanceWrapper<IComponent> {
    let wrapper: IInstanceWrapper<IComponent> = null;

    parent.modules.forEach((child) => {
      const { components, exports } = child;

      if (exports.has(target) && components.has(target)) {
        wrapper = components.get(target);

        if (!wrapper.instance) {
          this.loadComponentInstance(target, child);
        }
      }
    });

    return wrapper;
  }
}
