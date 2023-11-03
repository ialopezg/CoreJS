import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import * as sinon from 'sinon';

import {
  IMiddleware,
  MiddlewareContainer,
  MiddlewareResolver,
  RoutesMapper,
} from '../../middleware';
import { Component, LoggerService } from '../../../common';
import { ApplicationMode } from '../../../common/enums/application-mode.enum';

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

  before(() => LoggerService.setMode(ApplicationMode.TEST));

  beforeEach(() => {
    container = new MiddlewareContainer(new RoutesMapper());
    resolver = new MiddlewareResolver(container);
    mockContainer = sinon.mock(container);
  });

  it('should resolve middleware instances from container', () => {
    const loadInstanceOfMiddleware = sinon.stub(resolver['injector'], 'loadInstanceOfMiddleware');
    const middlewares = new Map();
    middlewares.set('TestMiddleware', {
      instance: { metaType: {} },
      metaType: TestMiddleware,
    });

    const module = <any>{ metaType: { name: '' }};
    mockContainer.expects('getMiddlewares').returns(middlewares);
    resolver.resolve(module, null);

    expect(loadInstanceOfMiddleware.callCount).to.be.equal(middlewares.size);
    expect(loadInstanceOfMiddleware.calledWith(
      TestMiddleware,
      middlewares,
      module,
    )).to.be.true;

    loadInstanceOfMiddleware.restore();
  });
});
