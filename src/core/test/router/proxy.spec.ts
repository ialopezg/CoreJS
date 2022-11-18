import { expect } from 'chai';
import * as sinon from 'sinon';

import { RouterProxy } from '../../router';
import { ExceptionHandler } from '../../exceptions';
import { HttpException } from '../../../common';

describe('RouterProxy', () => {
  let routerProxy: RouterProxy;
  let handlerMock: sinon.SinonMock;

  beforeEach(() => {
    const handler = new ExceptionHandler();
    handlerMock = sinon.mock(handler);
    routerProxy = new RouterProxy(handler);
  });

  describe('createProxy', () => {
    it('should method return thunk', () => {
      const proxy = routerProxy.create(() => { });
      expect(typeof proxy === 'function').to.be.true;
    });

    it('should method encapsulate callback passed as argument', () => {
      const expectation = handlerMock.expects('next').once();
      const proxy = routerProxy.create((_req: any, _res: any, _next: any) => {
        throw new HttpException('test', 500);
      });

      proxy(null, null, null);

      expectation.verify();
    });

    it('should method encapsulate async callback passed as argument', (done) => {
      const expectation = handlerMock.expects('next').once();
      const proxy = routerProxy.create(async (_req, _res, next_) => {
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
