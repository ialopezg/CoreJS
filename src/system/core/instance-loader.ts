import 'reflect-metadata';

import { Component, Controller } from './interfaces';
import { InstanceWrapper } from './container';

export class AppInstanceLoader {
  loadInstanceOfComponent(
    target: any,
    components: Map<Component, InstanceWrapper<Component>>,
  ) {
    const component = components.get(target);

    if (component.instance === null) {
      const args: any[] = [];
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param: any) => {
        if (typeof param === 'undefined') {
          throw new Error(
            `Can't create instance of ${target}` +
              '. It is possible that you are trying to do cycle-dependency A->B, B->A.',
          );
        }

        args.push(this.resolveComponentInstance(components, param, target));
      });

      component.instance = new target(...args);
    }
  }

  loadInstanceOfController(
    target: Controller | any,
    controllers: Map<Controller, InstanceWrapper<Controller>>,
    components: Map<Component, InstanceWrapper<Component>>,
  ) {
    const controller = controllers.get(target);

    if (controller.instance === null) {
      const args = [];
      const params = Reflect.getMetadata('design:paramtypes', target) || [];

      params.map((param: any) => {
        if (typeof param === 'undefined') {
          throw new Error(
            `Can't create instance of ${target}` +
              '. It is possible that you are trying to do cycle-dependency A->B, B->A.',
          );
        }

        args.push(this.resolveComponentInstance(components, param, target));
      });

      controller.instance = new target(...args);
    }
  }

  private resolveComponentInstance(
    collection: any,
    param: any,
    target: Component,
  ) {
    if (!collection.has(param)) {
      throw new Error(`Can't recognize dependencies of ${target}`);
    }

    const instanceWrapper = collection.get(param);

    if (instanceWrapper.instance === null) {
      this.loadInstanceOfComponent(param, collection);
    }

    return instanceWrapper.instance;
  }
}
