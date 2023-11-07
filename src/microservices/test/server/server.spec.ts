import { Server } from '../../server';
import { expect } from 'chai';

class TestServer extends Server {
  listen(callback: () => void) {}
}

describe('Server', () => {
  const server = new TestServer();
  const callback = () => {};
  const pattern = { test: 'test' };

  describe('add', () => {
    it('should add handler as stringified pattern key', () => {
      server.add(pattern, callback);

      const handlers = server.getHandlers();

      expect(handlers[JSON.stringify(pattern)]).to.equal(callback);
    });
  });
});
