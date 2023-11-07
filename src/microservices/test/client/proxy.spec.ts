import { expect } from 'chai';
import { Observable } from 'rxjs';
import * as sinon from 'sinon';

import { ClientProxy } from '../../client';

class TexClientProxy extends ClientProxy {
  sendSingleMessage(pattern: any, callback: Function) {}
}

describe('ClientProxy', () => {
  const client = new TexClientProxy();

  describe('send', () => {
    it('should return an observable stream', () => {
      const stream$ = client.send({}, '');

      expect(stream$ instanceof Observable).to.be.true;
    });

    it('should call "sendSingleMessage" on subscribe', () => {
      const pattern = { test: 3 };
      const data = 'test';
      const sendSingleMessage = sinon.spy();
      const stream$ = client.send(pattern, data);
      client.sendSingleMessage = sendSingleMessage;

      stream$.subscribe();

      expect(sendSingleMessage.calledOnce).to.be.true;
    });
  });

  describe('createObserver', () => {
    it('should return function', () => {
      expect(typeof client['createObserver'](null)).to.be.eql('function');
    });

    describe('returned function calls', () => {
      let fn: Function;
      const error = sinon.spy();
      const next = sinon.spy();
      const complete = sinon.spy();
      const observer = { error, next, complete };

      before(() => {
        fn = client['createObserver'](observer);
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
