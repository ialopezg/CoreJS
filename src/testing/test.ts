import { AppContainer, InstanceLoader, InstanceWrapper } from '../core/injector';
import { Metatype, ModuleMetadata } from '../common/interfaces';
import { Module } from '../common/decorators';
import { DependencyScanner } from '../core/scanner';
import { AppMode } from '../common/enums';

export class Test {
  private static container = new AppContainer();
  private static scanner = new DependencyScanner(Test.container);
  private static instanceLoader = new InstanceLoader(Test.container, AppMode.TEST);

  static createTestingModule(metadata: ModuleMetadata) {
    this.restart();
    const module = this.createModule(metadata);

    this.scanner.scan(module);
    this.instanceLoader.createInstancesOfDependencies();
  }

  static get<T>(metatype: Metatype<T>): T {
    const modules = this.container.getModules();
    return this.findInstanceByPrototype<T>(metatype, modules);
  }

  static restart() {
    this.container.clear();
  }

  private static findInstanceByPrototype<T>(metatype: Metatype<T>, modules) {
    for (const [_, module] of modules) {
      const dependencies = new Map([...module.components, ...module.routes]);
      const instanceWrapper = dependencies.get(metatype);

      if (instanceWrapper) {
        return (<InstanceWrapper<any>>instanceWrapper).instance;
      }
    }

    return null;
  }

  private static createModule(metadata: ModuleMetadata) {
    class TestModule { }
    Module(metadata)(TestModule);

    return TestModule;
  }
}

