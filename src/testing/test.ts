import { AppMode, LoggerService, Module } from '../common';
import { MetaType, ModuleMetadata } from '../common/interfaces';
import { Container, InstanceLoader, InstanceWrapper } from '../core/injector';
import { DependencyScanner } from '../core/scanner';

export class Test {
  private static container = new Container();
  private static scanner = new DependencyScanner(Test.container);
  private static loader = new InstanceLoader(Test.container);

  static createTestingModule(metadata: ModuleMetadata) {
    LoggerService.setMode(AppMode.TEST);

    this.restart();

    const module = this.createModule(metadata);
    this.scanner.scan(module);
    this.loader.createInstancesOfDependencies();
  }

  static get<T>(metaType: MetaType<T>): T {
    const modules = this.container.getModules();
    return this.findInstanceByPrototype<T>(metaType, modules);
  }

  static restart() {
    this.container.clear();
  }

  private static findInstanceByPrototype<T>(metaType: MetaType<T>, modules) {
    for (const [_, module] of modules) {
      const dependencies = new Map([...module.components, ...module.routes]);
      const instanceWrapper = dependencies.get(metaType.name);

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
