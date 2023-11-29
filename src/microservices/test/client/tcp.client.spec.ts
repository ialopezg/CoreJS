import * as sinon from 'sinon';
import { expect } from 'chai';

import { TcpClient } from '../../client';

describe('ClientTCP', () => {
  const client = new TcpClient({});

  describe('createCallback', () => {
    it(`should return function`, () => {
      expect(typeof client['createCallback'](null)).to.be.eql('function');
    });

    describe('callback', () => {
      const callback: sinon.SinonSpy = sinon.spy();
      let fn: any;

      beforeEach(() => {
        fn = client['createCallback'](callback);
      });

      it('should call callback with error when "err" is truthy', () => {
        const error = 'test';

        fn(error, null);

        expect(callback.calledWith(error)).to.be.true;
      });

      it('should call callback with response when "err" is not truthy', () => {
        const response = { error: 'test', response: 'restest' };

        fn(null, response);

        expect(callback.calledWith(response.error, response.response)).to.be.true;
      });
    });
  });
});
