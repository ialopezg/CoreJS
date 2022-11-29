import * as sinon from 'sinon';
import { expect } from 'chai';

import { RoutesResolver } from '../../router';
import { Controller, RequestMapping, RequestMethod } from '../../../common';

describe('RoutesResolver', () => {
  @Controller({ path: 'global' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() {
    }

    @RequestMapping({
      path: 'another-test',
      method: RequestMethod.POST,
    })
    anotherTest() {
    }
  }

  let router: any;
  let routesResolver: RoutesResolver;

  before(() => {
    router = {
      get() {},
      post() {},
    };
  });

  beforeEach(() => {
    routesResolver = new RoutesResolver(null, {
      createRouter: () => router,
    });
  });

  describe('setupRouters', () => {
    it('should method setup controllers to express application instance', () => {
      const routes = new Map();
      routes.set('TestController', {
        instance: new TestController(),
        metaType: TestController,
      });
      const use = sinon.spy();
      const applicationMock = { use };

      routesResolver.setupControllers(routes, <any>applicationMock);

      expect(use.calledOnce).to.be.true;
      expect(use.calledWith('/global', router)).to.be.true;
    });
  });
});
