import { expect } from 'chai';
import * as sinon from 'sinon';

import { SocketServerProvider } from '../provider';
import { SocketContainer } from '../container';

describe('SocketServerProvider', () => {
  let target: SocketServerProvider;
  let container: SocketContainer;
  let mockContainer: sinon.SinonMock;

  beforeEach(() => {
    container = new SocketContainer();
    mockContainer = sinon.mock(container);
    target = new SocketServerProvider(container);
  });

  describe('scan', () => {
    let createSpy: sinon.SinonSpy;
    const namespace = 'test';
    const port = 30;

    beforeEach(() => {
      createSpy = sinon.spy();
      target['create'] = createSpy;
    });

    it('should returns registered server', () => {
      const server = { test: 'test' };
      mockContainer.expects('get').returns(server);

      const result = target.scan(namespace, port);

      expect(createSpy.called).to.be.false;
      expect(result).to.eq(server);
    });

    it('should call "register" when server is not registered already', () => {
      mockContainer.expects('get').returns(null);

      target.scan(namespace, port);

      expect(createSpy.called).to.be.true;
    });
  });
});
