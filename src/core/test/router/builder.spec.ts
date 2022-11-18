import { expect } from 'chai';
import * as sinon from 'sinon';

import { RouterBuilder } from '../../router';
import { Controller, RequestMapping, RequestMethod } from '../../../common';
import { AppMode } from '../../../common/enums';

describe('RouterBuilder', () => {
  @Controller({ path: 'global' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() { }

    @RequestMapping({ path: 'test', method: RequestMethod.POST })
    postTest() { }

    @RequestMapping({ path: 'another-test', method: RequestMethod.ALL })
    anotherTest() { }

    private _simplePlainMethod() { }
  }

  let routerBuilder: RouterBuilder;
  beforeEach(() => {
    routerBuilder = new RouterBuilder(null, null, AppMode.TEST);
  });

  describe('scanForPathsFromPrototype', () => {
    it('should method return expected list of route paths', () => {
      const paths = routerBuilder.scanPathsFromPrototype(new TestController(), TestController.prototype);

      expect(paths).to.have.length(3);

      expect(paths[0].path).to.eql('/test');
      expect(paths[1].path).to.eql('/test');
      expect(paths[2].path).to.eql('/another-test');

      expect(paths[0].method).to.eql(RequestMethod.GET);
      expect(paths[1].method).to.eql(RequestMethod.POST);
      expect(paths[2].method).to.eql(RequestMethod.ALL);
    });
  });

  describe('exploreMethodMetadata', () => {
    it('should method return expected object which represent single route', () => {
      const instance = new TestController();
      const instanceProto = Object.getPrototypeOf(instance);

      const route = routerBuilder.exploreMethodMetadata(new TestController(), instanceProto, 'getTest');

      expect(route.path).to.eql('/test');
      expect(route.method).to.eql(RequestMethod.GET);
    });
  });

  describe('applyPathsToRouterProxy', () => {
    it('should method return expected object which represent single route', () => {
      const bindStub = sinon.stub(routerBuilder, 'bindMethodToRouterProxy');
      const paths = [null, null];

      routerBuilder.applyPathsToRouterProxy(null, paths);

      expect(bindStub.calledWith(null, null)).to.be.true;
      expect(bindStub.callCount).to.be.eql(paths.length);
    });
  });
});
