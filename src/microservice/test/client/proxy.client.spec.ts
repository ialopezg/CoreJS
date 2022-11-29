import { expect } from 'chai';
import { Observable } from 'rxjs';
import * as sinon from 'sinon';

import { ProxyClient } from '../../client';

class TestProxyClient extends ProxyClient {
  sendSingleMessage(pattern: any, callback: Function): void {
  }
}

describe('ProxyClient', () => {
  const client = new TestProxyClient();

  describe('send', () => {
    it('should return an observable stream', () => {
      const stream$ = client.send({}, '');

      expect(stream$ instanceof Observable).to.be.true;
    });

    it('should call "sendSingleMessage" on subscribe', () => {
      const pattern = { test: 3 };
      const data = 'test';
      const sendSingleMessageSpy = sinon.spy();
      const stream$ = client.send(pattern, data);
      client.sendSingleMessage = sendSingleMessageSpy;

      stream$.subscribe();

      expect(sendSingleMessageSpy.calledOnce).to.be.true;
    });
  });

  describe('createObserver', () => {
    it('should return function', () => {
      expect(typeof client.createObserver(null)).to.be.eql('function');
    });

    describe('returned function calls', () => {
      let fn;
      const error = sinon.spy();
      const next = sinon.spy();
      const complete = sinon.spy();
      const observer = {
        error,
        next,
        complete,
      };

      before(() => {
        fn = client.createObserver(observer);
      });

      it('"error" when first parameter is not null or undefined', () => {
        const err = 'test';
        fn(err);

        expect(error.calledWith(err)).to.be.true;
      });

      it('"next" when first parameter is null or undefined', () => {
        const data = 'test';
        fn(null, data);

        expect(next.calledWith(data)).to.be.true;
      });

      it('"complete" when first parameter is null or undefined', () => {
        const data = 'test';
        fn(null, data);
        
        expect(complete.called).to.be.true;
      });
    });
  });
});
