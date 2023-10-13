import { expect } from 'chai';
import * as sinon from 'sinon';

import { HttpException, ExceptionHandler } from '../../exceptions';

describe('ExceptionsHandler', () => {
  let handler: ExceptionHandler;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let response: any;

  beforeEach(() => {
    handler = new ExceptionHandler();
    statusStub = sinon.stub();
    jsonStub = sinon.stub();

    response = {
      status: statusStub,
      json: jsonStub,
    };
    response.status.returns(response);
    response.json.returns(response);
  });

  describe('next', () => {

    it('should method send expected response status code and message when exception is unknown', () => {
      handler.next(new Error(), response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Unknown exception' })).to.be.true;
    });

    it('should method send expected response status code and message when exception is instance of HttpException', () => {
      const status = 401;
      const message = 'Unauthorized';

      handler.next(new HttpException(message, status), response);

      expect(statusStub.calledWith(status)).to.be.true;
      expect(jsonStub.calledWith({ message })).to.be.true;
    });
  });
});
