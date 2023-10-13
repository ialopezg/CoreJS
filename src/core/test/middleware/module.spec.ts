import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import * as sinon from 'sinon';

import { Component, Controller, RequestMapping, RequestMethod } from '../../../common';
import { IMiddleware } from '../../middleware';
import { MiddlewareBuilder, MiddlewareModule } from '../../middleware';
import { InvalidMiddlewareException, RuntimeException } from '../../../errors';

describe('MiddlewareModule', () => {
  @Controller({ path: 'test' })
  class AnotherRoute {}

  @Controller({ path: 'test' })
  class TestRoute {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({ path: 'another', method: RequestMethod.DELETE })
    getAnother() {}
  }

  @Component()
  class TestMiddleware implements IMiddleware {
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

      MiddlewareModule['loadConfiguration'](<any>mockModule, <any>'Test');

      expect(configureSpy.calledOnce).to.be.true;
      expect(configureSpy.calledWith(new MiddlewareBuilder())).to.be.true;
    });
  });

  describe('setupRouteMiddleware', () => {
    it('should throw "RuntimeException" exception when middlewares is not stored in container', () => {
      const route = { path: 'Test' };
      const configuration = {
        middlewares: [TestMiddleware],
        forRoutes: [TestRoute],
      };

      const useSpy = sinon.spy();
      const app = { use: useSpy };

      expect(MiddlewareModule['setupControllerMiddleware'].bind(
        MiddlewareModule, route, configuration, <any>'Test', <any>app,
      )).throws(RuntimeException);
    });

    it('should throw "InvalidMiddlewareException" exception when middlewares does not have "resolve" method', () => {
      @Component()
      class InvalidMiddleware {}

      const route = { path: 'Test' };
      const configuration = {
        middlewares: [InvalidMiddleware],
        forRoutes: [TestRoute],
      };

      const useSpy = sinon.spy();
      const app = { use: useSpy };

      const container = MiddlewareModule.getContainer();
      const moduleKey = <any>'Test';
      container.addConfig([<any>configuration], moduleKey);

      const instance = new InvalidMiddleware();
      container.getMiddlewares(moduleKey).set('InvalidMiddleware', <any>{
        instance,
        metaType: InvalidMiddleware,
      });

      expect(MiddlewareModule['setupControllerMiddleware'].bind(
        MiddlewareModule, route, configuration, moduleKey, <any>app,
      )).throws(InvalidMiddlewareException);
    });

    it('should store middlewares when middleware is stored in container', () => {
      const route = { path: 'Test', method: RequestMethod.GET };
      const configuration = {
        middlewares: [TestMiddleware],
        forRoutes: [{ path: 'test' }, AnotherRoute, TestRoute],
      };

      const useSpy = sinon.spy();
      const app = {
        get: useSpy,
      };

      const container = MiddlewareModule.getContainer();
      const moduleKey = <any>'Test';
      container.addConfig([configuration], moduleKey);

      const instance = new TestMiddleware();
      container.getMiddlewares(moduleKey).set('TestMiddleware', {
        instance,
        metaType: TestMiddleware,
      });

      MiddlewareModule['setupControllerMiddleware'](route, configuration, moduleKey, <any>app);

      expect(useSpy.calledOnce).to.be.true;
    });
  });
});
