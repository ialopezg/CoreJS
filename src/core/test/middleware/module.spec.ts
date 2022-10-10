import { expect } from 'chai';
import * as sinon from 'sinon';

import { Middleware, MiddlewareBuilder } from '../../middleware';
import { Component, Controller, RequestMethod, RequestMapping } from '../../../common';
import { MiddlewareModule } from '../../middleware/module';
import { UnknownMiddlewareException, InvalidMiddlewareException } from '../../../errors/exceptions';
import { NextFunction, Request, Response } from 'express';

describe('MiddlewaresModule', () => {
  @Controller({ path: 'test' })
  class AnotherController { }

  @Controller({ path: 'test' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({ path: 'another', method: RequestMethod.DELETE })
    getAnother() {}
  }

  @Component()
  class TestMiddleware implements Middleware {
    resolve() {
      return (_request: Request, _response: Response, _next: NextFunction) => {};
    }
  }

  describe('loadConfiguration', () => {
    it('should call "configure" method if method is implemented', () => {
      const configureSpy = sinon.spy();
      const mockModule = {
        configure: configureSpy,
      };

      MiddlewareModule.loadConfiguration(<any>mockModule, <any>'Test');

      expect(configureSpy.calledOnce).to.be.true;
      expect(configureSpy.calledWith(new MiddlewareBuilder())).to.be.true;
    });
  });

  describe('setupControllerMiddleware', () => {
    it('should throw "UnknownMiddlewareException" exception when middlewares is not stored in container', () => {
      const route = { path: 'Test' };
      const configuration = {
        middlewares: [TestMiddleware],
        forRoutes: [TestController],
      };

      const useSpy = sinon.spy();
      const app = { use: useSpy };

      expect(MiddlewareModule.setupControllerMiddleware.bind(
        MiddlewareModule, route, configuration, <any>'Test', <any>app,
      )).throws(UnknownMiddlewareException);
    });

    it('should throw "InvalidMiddlewareException" exception when middlewares does not have "resolve" method', () => {
      @Component()
      class InvalidMiddleware {}

      const route = { path: 'Test' };
      const configuration = {
        middlewares: [InvalidMiddleware],
        forRoutes: [TestController],
      };

      const useSpy = sinon.spy();
      const app = { use: useSpy };

      const container = MiddlewareModule.getContainer();
      const moduleKey = <any>'Test';
      container.addConfig([<any>configuration], moduleKey);
      const instance = new InvalidMiddleware();
      container.getMiddlewares(moduleKey).set(<any>InvalidMiddleware, <any>instance);

      expect(MiddlewareModule.setupControllerMiddleware.bind(
        MiddlewareModule, route, configuration, moduleKey, <any>app,
      )).throws(InvalidMiddlewareException);
    });

    it('should store middlewares when middleware is stored in container', () => {
      const route = { path: 'Test', method: RequestMethod.GET };
      const configuration = {
        middlewares: [TestMiddleware],
        forRoutes: [{ path: 'test' }, AnotherController, TestController],
      };

      const useSpy = sinon.spy();
      const app = { get: useSpy };

      const container = MiddlewareModule.getContainer();
      const moduleKey = <any>'Test';
      container.addConfig([configuration], moduleKey);

      const instance = new TestMiddleware();
      container.getMiddlewares(moduleKey).set(TestMiddleware, instance);

      MiddlewareModule.setupControllerMiddleware(route, configuration, moduleKey, <any>app);

      expect(useSpy.calledOnce).to.be.true;
    });
  });
});
