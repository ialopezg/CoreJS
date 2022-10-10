import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import { AppModule, Component, Controller, RequestMapping, RequestMethod } from '../../../common';
import { Middleware, MiddlewareConfiguration, RoutesMapper } from '../../middleware';
import { MiddlewareContainer } from '../../middleware/container';

describe('MiddlewareContainer', () => {
  @Controller({ path: 'test' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({ path: 'another', method: RequestMethod.DELETE })
    getAnotherTest() {}
  }

  @Component()
  class TestMiddleware implements Middleware {
    resolve() {
      return (_request: Request, _response: Response, _next: NextFunction) => {};
    }
  }

  let container: MiddlewareContainer;

  beforeEach(() => {
    container = new MiddlewareContainer(new RoutesMapper());
  });

  it('should store expected configurations for given module', () => {
    const config: MiddlewareConfiguration[] = [
      {
        middlewares: [TestMiddleware],
        forRoutes: [TestController, { path: 'test' }],
      },
    ];

    container.addConfig(config, <AppModule>'Module');

    expect([...container.getConfigs().get(<AppModule>'Module')]).to.deep.equal(config);
  });

  it('should store expected middlewares for given module', () => {
    const config: MiddlewareConfiguration[] = [
      {
        middlewares: TestMiddleware,
        forRoutes: [TestController],
      },
    ];

    const key = <any>'Test';
    container.addConfig(config, key);

    expect(container.getMiddlewares(key).size).to.eql(config.length);
    expect(container.getMiddlewares(key).get(TestMiddleware)).to.eql(null);
  });
});
