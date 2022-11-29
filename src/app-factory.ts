import { Application } from './application';
import { isFunction, LoggerService } from './common';
import { ModuleMetaType } from './common/interfaces';
import { ExpressAdapter } from './core/adapters';
import { messages } from './core/constants';
import { Container, InstanceLoader } from './core/injector';
import { DependencyScanner } from './core/scanner';
import { ExceptionWrapper } from './errors';
import { Microservice } from './microservice';
import { MicroserviceConfiguration } from './microservice/interfaces';

/**
 * Application Factory for Apps or Microservices.
 */
export class AppFactory {
  private static readonly logger = new LoggerService(AppFactory.name);
  private static readonly container = new Container();
  private static scanner = new DependencyScanner(AppFactory.container);
  private static loader = new InstanceLoader(AppFactory.container);

  /**
   * Creates an application instance.
   *
   * @param target Target module
   * @param express Target Express Application
   */
  static create(target: ModuleMetaType, express = ExpressAdapter.create()): Application {
    this.initialize(target);

    return this.createInstance<Application>(new Application(this.container, express));
  }

  /**
   * Creates a microservice instance.
   *
   * @param target Target module
   * @param config Microservice configuration
   */
  static createMicroservice(target: ModuleMetaType, config?: MicroserviceConfiguration): Microservice {
    this.initialize(target);

    return this.createInstance<Microservice>(new Microservice(this.container, config));
  }

  private static createInstance<T>(instance: T) {
    const proxy = this.createProxy(instance);
    proxy.setup();

    return proxy;
  }

  private static createProxy(target: any) {
    return new Proxy(target, {
      get: this.createExceptionMethodProxy(),
      set: this.createExceptionMethodProxy(),
    });
  }

  private static createExceptionMethodProxy() {
    return (receiver, prop) => {
      if (!(prop in receiver)) {
        return undefined;
      }

      if (isFunction(receiver[prop])) {
        return (...args) => ExceptionWrapper.run(() => {
          receiver[prop](...args);
        });
      }

      return receiver[prop];
    };
  }

  /**
   * Initialize all modules and their dependencies/
   *
   * @param target Module to be initialized.
   */
  private static initialize(target: ModuleMetaType) {
    ExceptionWrapper.run(() => {
      this.logger.log(messages.APPLICATION_START);
      this.scanner.scan(target);
      this.loader.createInstancesOfDependencies();
    });
  }
}
