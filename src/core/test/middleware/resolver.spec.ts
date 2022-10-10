import { NextFunction, Request, Response } from 'express';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { MiddlewareResolver } from '../../middleware/resolver';
import { MiddlewareContainer } from '../../middleware/container';
import { Component } from '../../../common';
import { Middleware, RoutesMapper } from '../../middleware';

describe('MiddlewaresResolver', () => {
  @Component()
  class TestMiddleware implements Middleware {
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
    const loadInstanceOfMiddleware = sinon.stub(
      // eslint-disable-next-line dot-notation
      resolver['injector'],
      'loadInstanceOfMiddleware',
    );
    const middlewares = new Map();
    middlewares.set(TestMiddleware, null);

    mockContainer.expects('getMiddlewares').returns(middlewares);
    resolver.resolveInstances(null, null);

    expect(loadInstanceOfMiddleware.callCount).to.be.equal(middlewares.size);
    expect(loadInstanceOfMiddleware.calledWith(TestMiddleware, middlewares, null)).to.be.true;

    loadInstanceOfMiddleware.restore();
  });
});