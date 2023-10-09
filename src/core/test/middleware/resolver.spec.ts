import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import * as sinon from 'sinon';

import {
  IMiddleware,
  MiddlewareContainer,
  MiddlewareResolver,
  RoutesMapper,
} from '../../middleware';
import { Component } from '../../../common';

describe('MiddlewaresResolver', () => {
  @Component()
  class TestMiddleware implements IMiddleware {
    resolve() {
      return (_request: Request, _response: Response, _next: NextFunction) => {};
    }
  }

  let resolver: MiddlewareResolver;
  let container: MiddlewareContainer;
  let mockContainer: sinon.SinonMock;

  beforeEach(() => {
    container = new MiddlewareContainer(new RoutesMapper());
    resolver = new MiddlewareResolver(container);
    mockContainer = sinon.mock(container);
  });

  it('should resolve middleware instances from container', () => {
    const loadInstanceOfMiddleware = sinon.stub(resolver['injector'], 'loadInstanceOfMiddleware');
    const middlewares = new Map();
    middlewares.set(TestMiddleware, null);

    mockContainer.expects('getMiddlewares').returns(middlewares);
    resolver.resolve(null, null);

    expect(loadInstanceOfMiddleware.callCount).to.be.equal(middlewares.size);
    expect(loadInstanceOfMiddleware.calledWith(
      TestMiddleware,
      middlewares,
      null,
    )).to.be.true;

    loadInstanceOfMiddleware.restore();
  });
});
