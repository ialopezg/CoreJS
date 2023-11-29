import * as sinon from 'sinon';

import { SocketContainer } from '../container';
import { expect } from 'chai';

describe('SocketContainer', () => {
  const namespace = '/';
  const port = 30;
  let target: SocketContainer;
  let getSpy: sinon.SinonSpy;
  let setSpy: sinon.SinonSpy;

  beforeEach(() => {
    getSpy = sinon.spy();
    setSpy = sinon.spy();
    target = new SocketContainer();
    (<any>target)['sockets'] = { get: getSpy, set: setSpy };
  });

  describe('get', () => {
    it('should call "servers" get method with expected arguments', () => {
      target.get(namespace, port);

      expect(getSpy.calledWith({ namespace, port }));
    });
  });

  describe('register', () => {
    it('should call "servers" set method with expected arguments', () => {
      const server = {};
      target.register(namespace, port, <any>server);

      expect(setSpy.calledWith({ namespace, port }, server));
    });
  });
});
