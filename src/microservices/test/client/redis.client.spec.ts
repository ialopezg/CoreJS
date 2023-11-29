import { expect } from 'chai';
import * as sinon from 'sinon';

import { RedisClient } from '../../client';

describe('RedisClient', () => {
  const test = 'test';
  const client = new RedisClient({});

  describe('getAckPatternName', () => {
    it('should append _ack to string', () => {
      const expectedResult = `${test}_ack`;

      expect(client['getAckPatternName'](test)).to.equal(expectedResult);
    });
  });

  describe('getResPatternName', () => {
    it('should append _res to string', () => {
      const expectedResult = `${test}_res`;

      expect(client['getResPatternName'](test)).to.equal(expectedResult);
    });
  });

  describe('sendSingleMessage', () => {
    const pattern = 'test';
    const message = { pattern };
    let subscribeSpy: sinon.SinonSpy;
    let publishSpy: sinon.SinonSpy;
    let onSpy: sinon.SinonSpy;
    let removeListenerSpy: sinon.SinonSpy;
    let unsubscribeSpy: sinon.SinonSpy;
    let subscriber: any;
    let publisher: any;

    beforeEach(() => {
      subscribeSpy = sinon.spy();
      publishSpy = sinon.spy();
      onSpy = sinon.spy();
      removeListenerSpy = sinon.spy();
      unsubscribeSpy = sinon.spy();

      subscriber = {
        subscribe: subscribeSpy,
        on: onSpy,
        removeListener: removeListenerSpy,
        unsubscribe: unsubscribeSpy,
      };
      publisher = { publish: publishSpy };
      client['publisher'] = publisher;
      client['subscriber'] = subscriber;
    });

    it('should subscribe to response pattern name', () => {
      client.sendSingleMessage(message, () => {});

      expect(subscribeSpy.calledWith(`"${pattern}"_res`)).to.be.true;
    });

    it('should publish stringified message to acknowledge pattern name', () => {
      client.sendSingleMessage(message, () => {});

      expect(publishSpy.calledWith(
        `"${pattern}"_ack`,
        JSON.stringify(message)),
      ).to.be.true;
    });

    it('should listen on messages', () => {
      client.sendSingleMessage(message, () => {});

      expect(onSpy.called).to.be.true;
    });

    describe('subscription', () => {
      const callback = sinon.spy();
      const resMsg = {
        error: 'err',
        response: 'test'
      };
      let subscription: any;

      beforeEach(() => {
        subscription = client.sendSingleMessage(message, callback);
        subscription(null, JSON.stringify(resMsg));
      });

      it('should call callback with expected arguments', () => {
        expect(callback.calledWith(resMsg.error, resMsg.response)).to.be.true;
      });

      it('should unsubscribe to response pattern name', () => {
        expect(unsubscribeSpy.calledWith(`"${pattern}"_res`)).to.be.true;
      });

      it('should remove listener', () => {
        expect(removeListenerSpy.called).to.be.true;
      });
    });
  });
});
