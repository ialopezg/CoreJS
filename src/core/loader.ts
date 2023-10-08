import 'reflect-metadata';

import { IComponent, IController } from './interfaces';
import { IInstanceWrapper } from './container';

/**
 * Dependencies Instance Loader.
 */
export class InstanceLoader {
  /**
   * Load the instance of given component object.
   *
   * @param {IComponent} component Controller object to be loaded.
   * @param {Map<IComponent, IInstanceWrapper<IComponent>>} components Current register components collection.
   */
  public loadComponentInstance(component: IComponent, components: Map<IComponent, IInstanceWrapper<IComponent>>) {
    const fetchedComponent = components.get(component);
    if (!fetchedComponent.instance) {
      const args: IComponent[] = [];
      const params = Reflect.getMetadata('design:paramtypes', component) || [];

      params.map((param) => {
        if (typeof param === 'undefined') {
          throw new Error(
            `Can't create instance of ${component}. It is possible that you are trying to do a cycle-dependency A->B, B->A.`,
          );
        }

        const instance = this.resolveComponentInstance(components, param, component);
        args.push(instance);
      });

      fetchedComponent.instance = new (<any>component)(...args);
    }
  }

  /**
   * Load the instance of given controller object.
   *
   * @param {IController} controller Controller object to be loaded.
   * @param {Map<IController, IInstanceWrapper<IController>>} controllers Current register controller collection.
   * @param {Map<IComponent, IInstanceWrapper<IComponent>>} components Current register components collection.
   */
  public loadInstanceOfController(
    controller: IController,
    controllers: Map<IController, IInstanceWrapper<IController>>,
    components: Map<IComponent, IInstanceWrapper<IComponent>>,
  ): void {
    const fetchedController = controllers.get(controller);

    if (!fetchedController.instance) {
      const args: IComponent[] = [];
      const params = Reflect.getMetadata('design:paramtypes', controller) || [];

      params.map((param) => {
        if (typeof param === 'undefined') {
          throw new Error(
            `Can't create instance of ${controller}. It is possible that you are trying to do a cycle-dependency A->B, B->A.`,
          );
        }

        const instance = this.resolveComponentInstance(components, param, controller);
        args.push(instance);
      });

      fetchedController.instance = new (<any>controller)(...args);
    }
  }

  private resolveComponentInstance(
    components: Map<IComponent, IInstanceWrapper<IComponent>>,
    param: IComponent,
    component: IComponent | IController,
  ): IComponent {
    if (!components.has(param)) {
      throw new Error(`Dependencies for ${component} component can't be recognized!`);
    }

    const wrapper = components.get(param);
    if (!wrapper.instance) {
      this.loadComponentInstance(param, components);
    }

    return wrapper.instance;
  }
}
