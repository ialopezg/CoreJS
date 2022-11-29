import { expect } from 'chai';

import { Transport } from '../../../common';

import { ProxyClientFactory, RedisClient, TCPClient } from '../../client';

describe('ProxyClientFactory', () => {
  describe('create', () => {
    it('should create TCP client by default', () => {
      const proxy = ProxyClientFactory.create({});

      expect(proxy instanceof TCPClient).to.be.true;
    });

    it('should create Redis client', () => {
      const proxy = ProxyClientFactory.create({ transport: Transport.REDIS });

      expect(proxy instanceof RedisClient).to.be.true;
    });
  });
});
