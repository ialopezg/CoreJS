import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  Controller,
  LoggerService,
  RequestMapping,
  RequestMethod,
} from '../../../common';
import { RouterBuilder } from '../../router';
import { ApplicationMode } from '../../../common/enums/application-mode.enum';

describe('RouterBuilder', () => {
  @Controller({ path: 'global' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({ path: 'test', method: RequestMethod.POST })
    postTest() {}

    @RequestMapping({ path: 'another-test', method: RequestMethod.ALL })
    anotherTest() {}

    private simplePlainMethod() {}
  }

  let builder: RouterBuilder;
  before(() => LoggerService.setMode(ApplicationMode.TEST));

  beforeEach(() => {
    builder = new RouterBuilder(
      null,
      null,
    );
  });

  describe('scanForPathsFromPrototype', () => {
    it('should method return expected list of route paths', () => {
      const paths = builder.scanForPathsFromPrototype(new TestController(), TestController.prototype);

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

      const route = builder['exploreMethodMetadata'](new TestController(), instanceProto, 'getTest');

      expect(route.path).to.eql('/test');
      expect(route.method).to.eql(RequestMethod.GET);
    });

  });

  describe('applyPathsToRouterProxy', () => {
    it('should method return expected object which represent single route', () => {
      const bindStub = sinon.stub(builder, 'bind');
      const paths = [null, null];

      builder['apply'](null, paths);

      expect(bindStub.calledWith(null, null)).to.be.true;
      expect(bindStub.callCount).to.be.eql(paths.length);
    });
  });
});
