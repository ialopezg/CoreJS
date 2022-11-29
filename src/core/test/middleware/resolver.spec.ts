import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import * as sinon from 'sinon';

import { MiddlewareResolver } from '../../middleware/resolver';
import { MiddlewareContainer } from '../../middleware/container';
import { AppMode, Component, LoggerService } from '../../../common';
import { AppMiddleware, RoutesMapper } from '../../middleware';

describe('MiddlewaresResolver', () => {
  @Component()
  class TestMiddleware implements AppMiddleware {
    resolve() {
      return (_request: Request, _response: Response, _next: NextFunction) => {
      };
    }
  }

  let resolver: MiddlewareResolver;
  let container: MiddlewareContainer;
  let mockContainer: sinon.SinonMock;

  before(() => LoggerService.setMode(AppMode.TEST));

  beforeEach(() => {
    container = new MiddlewareContainer(new RoutesMapper());
    resolver = new MiddlewareResolver(container);
    mockContainer = sinon.mock(container);
  });

  it('should resolve middleware instances from container', () => {
    // eslint-disable-next-line dot-notation
    const loadInstanceOfMiddleware = sinon.stub(resolver['injector'], 'loadInstanceOfMiddleware');
    const middlewares = new Map();
    middlewares.set('TestMiddleware', {
      instance: { metaType: {} },
      metaType: TestMiddleware,
    });

    const module = <any>{ metaType: { name: '' } };
    mockContainer.expects('getMiddlewares').returns(middlewares);
    resolver.resolveInstances(module, null);

    expect(loadInstanceOfMiddleware.callCount).to.be.equal(middlewares.size);
    expect(loadInstanceOfMiddleware.calledWith(
      TestMiddleware,
      middlewares,
      module,
    )).to.be.true;

    loadInstanceOfMiddleware.restore();
  });
});
