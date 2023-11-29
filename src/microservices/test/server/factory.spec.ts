import { expect } from 'chai';

import { Transport } from '../../../common';
import { RedisServer, ServerFactory, TcpServer } from '../../server';

describe('ServerFactory', () => {
  describe('create', () => {
    it(`should return tcp server by default`, () => {
      expect(ServerFactory.create({}) instanceof TcpServer).to.be.true;
    });
    it(`should return redis server if transport is set to redis`, () => {
      expect(ServerFactory.create({ transport: Transport.REDIS }) instanceof RedisServer).to.be.true;
    });
  });
});
