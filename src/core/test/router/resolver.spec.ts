import { expect } from 'chai';
import * as sinon from 'sinon';

import { Controller, RequestMapping, RequestMethod } from '../../../common';
import { RouteResolver } from '../../router';

describe('RoutesResolver', () => {
  @Controller({ path: 'global' })
  class TestRoute {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({ path: 'another-test', method: RequestMethod.POST })
    anotherTest() {}
  }

  let router: any;
  let routesResolver: RouteResolver;

  before(() => {
    router = {
      get() {},
    };
  });

  beforeEach(() => {
    routesResolver = new RouteResolver(null, {
      createRouter: () => router,
    });
  });

  describe('setupRouters', () => {
    it('should method setup controllers to express application instance', () => {
      const routes = new Map();
      routes.set(TestRoute, { instance: new TestRoute() });

      const use = sinon.spy();
      const applicationMock = { use };

      routesResolver['setupControllers'](routes, <any>applicationMock);

      expect(use.calledOnce).to.be.true;
      expect(use.calledWith('/global', router)).to.be.true;
    });
  });
});
