import { LoggerService, Module as ModuleDecorator } from '../common';
import { MetaType, ModuleMetadata } from '../common/interfaces';
import {
  InstanceLoader,
  InstanceWrapper,
  Module,
  ModuleContainer,
} from '../core/injector';
import { DependencyScanner } from '../core/scanner';

export class Test {
  private static readonly container = new ModuleContainer();
  private static readonly scanner = new DependencyScanner(this.container);
  private static readonly loader = new InstanceLoader(
    this.container,
  );

  static initialize(metadata: ModuleMetadata) {
    this.restart();
    const target = this.createModule(metadata);

    this.scanner.scan(target);
    this.loader.initialize();
  }

  private static createModule(metadata: ModuleMetadata) {
    LoggerService.setMode(ApplicationMode.TEST);

    class TestModule {}

    ModuleDecorator(metadata)(TestModule);

    return TestModule;
  }

  private static findInstanceByPrototype<T>(metaType: MetaType<T>, modules: Map<string, Module>) {
    for(const [ _, module ] of modules) {
      const dependencies = new Map([ ...module.components, ...module.controllers ]);
      const instanceWrapper = dependencies.get(metaType.name);

      if (instanceWrapper) {
        return (<InstanceWrapper<any>>instanceWrapper).instance;
      }
    }
    return null;
  }

  static get<T>(metaType: MetaType<T>): T {
    const modules = this.container.getModules();

    return this.findInstanceByPrototype<T>(metaType, modules);
  }

  private static restart() {
    this.container.clear();
  }
}
