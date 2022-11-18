import { expect } from 'chai';

import { Component, Controller, RequestMapping, RequestMethod } from '../../../common';
import { MiddlewareContainer } from '../../middleware/container';
import { AppMiddleware, MiddlewareConfiguration, RoutesMapper } from '../../middleware';
import { NextFunction, Request, Response } from 'express';

describe('MiddlewareContainer', () => {
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
      return (_request: Request, _response: Response, _next: NextFunction) => {};
    }
  }

  let container: MiddlewareContainer;

  beforeEach(() => {
    container = new MiddlewareContainer(new RoutesMapper());
  });

  it('should store expected configurations for given module', () => {
    const config: MiddlewareConfiguration[] = [{
      middlewares: [TestMiddleware],
      forRoutes: [
        TestController,
        { path: 'test' },
      ],
    }];

    container.addConfig(config, <any>'Module');

    expect([...container.getConfigs().get('Module')]).to.deep.equal(config);
  });

  it('should store expected middlewares for given module', () => {
    const config: MiddlewareConfiguration[] = [{
      middlewares: TestMiddleware,
      forRoutes: [TestController],
    }];

    const key = <any>'TestModule';
    container.addConfig(config, key);

    expect(container.getMiddlewares(key).size).to.eql(config.length);
    expect(container.getMiddlewares(key).get('TestMiddleware')).to.eql({
      instance: null,
      metaType: TestMiddleware,
    });
  });
});
