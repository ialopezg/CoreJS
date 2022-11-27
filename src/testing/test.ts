import { AppContainer, InstanceLoader, InstanceWrapper } from '../core/injector';
import { MetaType, ModuleMetadata } from '../common/interfaces';
import { AppMode, Module } from '../common';
import { DependencyScanner } from '../core/scanner';

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

  static get<T>(metatype: MetaType<T>): T {
    const modules = this.container.getModules();
    return this.findInstanceByPrototype<T>(metatype, modules);
  }

  static restart() {
    this.container.clear();
  }

  private static findInstanceByPrototype<T>(metaType: MetaType<T>, modules) {
    for (const [_, module] of modules) {
      const dependencies = new Map([...module.components, ...module.routes]);
      const instanceWrapper = dependencies.get(metaType);

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
