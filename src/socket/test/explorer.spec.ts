import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import * as sinon from 'sinon';

import { AppMiddleware, MiddlewareBuilder } from '../../core';
import { Component, Controller, RequestMapping, RequestMethod, RuntimeException } from '../../common';
import { MiddlewareModule } from '../../core/middleware/module';
import { InvalidMiddlewareException } from '../../errors/exceptions';

describe('GatewayMetadataExplorer', () => {
  @Controller({ path: 'test' })
  class AnotherController {}

  @Controller({ path: 'test' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({
      path: 'another',
      method: RequestMethod.DELETE,
    })
    getAnother() {}
  }

  @Component()
  class TestMiddleware implements AppMiddleware {
    resolve() {
      return (_request: Request, _response: Response, _next: NextFunction) => {
      };
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
    it('should throw "InvalidMiddlewareException" exception when middlewares does not have "resolve" method', () => {
      @Component()
      class InvalidMiddleware {}

      const route = { path: 'test' };
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
      container.getMiddlewares(moduleKey).set('InvalidMiddleware', <any>{
        metaType: InvalidMiddleware,
        instance,
      });

      expect(MiddlewareModule.setupControllerMiddleware.bind(
        MiddlewareModule, route, configuration, moduleKey, <any>app,
      )).throws(InvalidMiddlewareException);
    });

    it('should store middlewares when middleware is stored in container', () => {
      const route = {
        path: 'test',
        method: RequestMethod.GET,
      };
      const configuration = {
        middlewares: [TestMiddleware],
        forRoutes: [{ path: 'test' }, AnotherController, TestController],
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
        metaType: TestMiddleware,
        instance,
      });

      MiddlewareModule.setupControllerMiddleware(route, configuration, moduleKey, <any>app);

      expect(useSpy.calledOnce).to.be.true;
    });
  });
});
