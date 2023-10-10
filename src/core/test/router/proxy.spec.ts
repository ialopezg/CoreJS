import { expect } from 'chai';
import * as sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';

import { Exception, ExceptionHandler } from '../../exceptions';
import { RouterProxy } from '../../router';

describe('RouterProxy', () => {
  let routerProxy: RouterProxy;
  let handlerMock: sinon.SinonMock;

  beforeEach(() => {
    const handler = new ExceptionHandler();
    handlerMock = sinon.mock(handler);
    routerProxy = new RouterProxy(<any>handler);
  });

  describe('createProxy', () => {
    it('should method return thunk', () => {
      const proxy = routerProxy.createProxy(() => {});

      expect(typeof proxy === 'function').to.be.true;
    });

    it('should method encapsulate callback passed as argument', () => {
      const expectation = handlerMock.expects('next').once();
      const proxy = routerProxy.createProxy((request: Request, response: Response, next: NextFunction) => {
        throw new Exception('test', 500);
      });
      proxy(null, null, null);

      expectation.verify();
    });

    it('should method encapsulate async callback passed as argument', (done) => {
      const expectation = handlerMock.expects('next').once();
      const proxy = routerProxy.createProxy(async (request: Request, response: Response, next: NextFunction) => {
        throw new Exception('test', 500);
      });
      proxy(null, null, null);

      setTimeout(() => {
        expectation.verify();
        done();
      }, 0);
    });
  });
});
