import { expect } from 'chai';

import { ClientProxyFactory } from '../../client/factory';
import { RedisClient, TcpClient } from '../../client';
import { Transport } from '../../../common';

describe('ClientProxyFactory', () => {
  describe('create', () => {
    it('should create TCP Client by default', () => {
      const proxy = ClientProxyFactory.create({});

      expect(proxy instanceof TcpClient).to.be.true;
    });

    it('should create Redis Client by default', () => {
      const proxy = ClientProxyFactory.create({ transport: Transport.REDIS });

      expect(proxy instanceof RedisClient).to.be.true;
    });
  });
});
