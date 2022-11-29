import { expect } from 'chai';

import { ServerRedis, ServerFactory, ServerTCP } from '../../server';
import { Transport } from '../../../common';

describe('ServerFactory', () => {
  describe('create', () => {
    it('should return tcp server by default', () => {
      expect(ServerFactory.create({}) instanceof ServerTCP).to.be.true;
    });

    it('should return redis server if transport is set to redis', () => {
      expect(ServerFactory.create({ transport: Transport.REDIS }) instanceof ServerRedis).to.be.true;
    });
  });
});
