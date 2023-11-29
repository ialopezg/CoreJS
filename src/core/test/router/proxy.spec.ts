import { expect } from 'chai';
import * as sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';

import { HttpException, ExceptionHandler } from '../../exceptions';
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
      const proxy = routerProxy.createProxy((_request: Request, _response: Response, _next: NextFunction) => {
        throw new HttpException('test', 500);
      });
      proxy(null, null, null);

      expectation.verify();
    });

    it('should method encapsulate async callback passed as argument', (done) => {
      const expectation = handlerMock.expects('next').once();
      const proxy = routerProxy.createProxy(async (_request: Request, _response: Response, _next: NextFunction) => {
        throw new HttpException('test', 500);
      });
      proxy(null, null, null);

      setTimeout(() => {
        expectation.verify();
        done();
      }, 0);
    });
  });
});
