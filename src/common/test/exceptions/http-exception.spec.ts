import { expect } from 'chai';
import { HttpStatus } from '../../enums';

import { HttpException } from '../../exceptions';

describe('Exception', () => {
  it('constructor is called with default options', () => {
    const exception = new HttpException();

    expect(exception.getStatus()).to.be.eql(400);
    expect(exception.getMessage()).to.be.eql('Bad Request');
  });

  it('should calls the constructor with 500 status code', () => {
    const error = new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    const message = error.getMessage();
    const status = error.getStatus();

    expect(status).to.be.eql(500);
    expect(message).to.be.eql(message);
  });
});
