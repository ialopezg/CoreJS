import { Application as Express } from 'express';

import { InstanceLoader, ModuleContainer } from './core/injector';
import { DependencyScanner } from './core/scanner';
import { LoggerService } from './common';
import { ModuleMetaType } from './common/interfaces';
import { ExceptionWrapper } from './errors';
import { messages } from './core/constants';
import { Application } from './application';
import { isFunction } from '@ialopezg/commonjs';
import { ExpressAdapter } from './core/adapters';
import { MicroserviceConfiguration } from './microservices';
import { Microservice } from './microservice';

/**
 * Represents an application factory.
 */
export class AppFactory {
  private static logger = new LoggerService(AppFactory.name);
  private static readonly container = new ModuleContainer();
  private static readonly scanner = new DependencyScanner(AppFactory.container);
  private static readonly loader = new InstanceLoader(AppFactory.container);

  /**
   * Create a new application instance.
   *
   * @param {ModuleMetaType} target Initiator module.
   * @param {Express} express Express application.
   */
  public static create(
    target: ModuleMetaType,
    express: Express = ExpressAdapter.create(),
  ): Application {
    this.initialize(target);

    return this.createInstance<Application>(
      new Application(this.container, express),
    );
  }

  /**
   * Create a new application instance.
   *
   * @param {ModuleMetaType} target Initiator module.
   * @param {MicroserviceConfiguration} config Microservice configuration.
   */
  public static createMicroservice(
    target: ModuleMetaType,
    config?: MicroserviceConfiguration,
  ): Microservice {
    this.initialize(target);

    return this.createInstance<Microservice>(
      new Microservice(this.container, config),
    );
  }

  private static initialize(target: ModuleMetaType) {
    ExceptionWrapper.run(() => {
      this.logger.log(messages.APPLICATION_START);
      this.scanner.scan(target);
      this.loader.initialize();
    });
  }

  private static createInstance<T>(target: T) {
    const proxy = this.createProxy<T>(target);
    proxy.setup();

    return proxy;
  }

  private static createProxy<T>(target: T): any {
    return new Proxy(<any>target, {
      get: this.createExceptionProxy(),
      set: this.createExceptionProxy(),
    });
  }

  private static createExceptionProxy(): any {
    return (receiver: any, property: any) => {
      if (!(property in receiver)) {
        return undefined;
      }

      if (isFunction(receiver[property])) {
        return (...args: any[]) => ExceptionWrapper.run(() => {
          receiver[property](...args);
        });
      }

      return receiver[property];
    };
  }
}
