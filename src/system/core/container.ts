import { AppModule, Component, Controller } from './interfaces';

export class Container {
  private readonly modules = new Map<AppModule, ModuleDependency>();

  addModule(module: AppModule): void {
    if (!this.modules.has(module)) {
      this.modules.set(module, {
        components: new Map<Component, InstanceWrapper<Component>>(),
        controllers: new Map<Controller, InstanceWrapper<Controller>>(),
      });
    }
  }

  addComponent(component: any, module: AppModule): void {
    if (this.modules.has(module)) {
      const storedModule = this.modules.get(module);
      storedModule.components.set(component, { instance: null });
    }
  }

  addController(controller: any, module: AppModule) {
    if (this.modules.has(module)) {
      const storedModule = this.modules.get(module);
      storedModule.controllers.set(controller, {
        instance: null,
      });
    }
  }

  getModules(): Map<AppModule, ModuleDependency> {
    return this.modules;
  }
}

export interface ModuleDependency {
  controllers?: Map<Controller, InstanceWrapper<Controller>>;
  components?: Map<Component, InstanceWrapper<Component>>;
}

export interface InstanceWrapper<T> {
  instance: T;
}
