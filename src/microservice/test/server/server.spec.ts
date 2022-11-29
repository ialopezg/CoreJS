import { expect } from 'chai';
import { Server } from '../../server';

class TestServer extends Server {
  listen(callback: () => void) {}
}

describe('Server', () => {
  const server = new TestServer();
  const callback = () => {};
  const pattern = { test: 'test' };

  describe('add', () => {
    it('should add handler as a stringify pattern key', () => {
      server.add(pattern, callback);

      const handlers = server.getHandlers();
      expect(handlers[JSON.stringify(pattern)]).to.equal(callback);
    });
  });
});
