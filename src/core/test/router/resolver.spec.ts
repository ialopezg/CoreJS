import { expect } from 'chai';
import * as sinon from 'sinon';

import { ApplicationMode, Controller, RequestMapping, RequestMethod } from '../../../common';
import { RouteResolver } from '../../router';

describe('RoutesResolver', () => {
  @Controller({ path: 'global' })
  class TestController {
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
      post() {},
    };
  });

  beforeEach(() => {
    routesResolver = new RouteResolver(
      null, {
        createRouter: () => router,
      },
      ApplicationMode.TEST,
    );
  });

  describe('setupControllers', () => {
    it('should method "setupControllers" to express application instance', () => {
      const controllers = new Map();
      controllers.set('TestController', {
        instance: new TestController(),
        metaType: TestController,
      });

      const use = sinon.spy();
      const applicationMock = { use };

      routesResolver['setupControllers'](controllers, <any>applicationMock);

      expect(use.calledOnce).to.be.true;
      expect(use.calledWith('/global', router)).to.be.true;
    });
  });
});
