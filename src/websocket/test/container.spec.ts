import * as sinon from 'sinon';
import { expect } from 'chai';
import { SocketsContainer } from '../sockets.container';

describe('SocketsContainer', () => {
  const namespace = 'test';
  const port = 30;
  let instance: SocketsContainer;
  let getSpy: sinon.SinonSpy;
  let setSpy: sinon.SinonSpy;

  beforeEach(() => {
    setSpy = sinon.spy();
    getSpy = sinon.spy();
    instance = new SocketsContainer();
    // eslint-disable-next-line dot-notation
    (<any>instance)['socketServers'] = {
      get: getSpy,
      set: setSpy,
    };
  });

  describe('getSocketServer', () => {
    it('should call "socketServers" get method with expected arguments', () => {
      instance.getSocketServer(namespace, port);

      expect(getSpy.calledWith({
        namespace,
        port,
      }));
    });
  });

  describe('storeObservableServer', () => {
    it('should call "socketServers" set method with expected arguments', () => {
      const server = {};
      instance.setSocketServer(namespace, port, <any>server);

      expect(setSpy.calledWith({
        namespace,
        port,
      }, server));
    });
  });
});
