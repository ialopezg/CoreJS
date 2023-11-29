import * as sinon from 'sinon';
import { expect } from 'chai';

import { WebSocketsController } from '../controller';
import { WebSocketGateway } from '../decorators';
import { InvalidServerSocketPortException } from '../exceptions';
import { GatewayMetadataExplorer } from '../explorer';
import { SocketServerProvider } from '../provider';

describe('WebSocketsController', () => {
  let target: WebSocketsController;
  let provider: SocketServerProvider;
  let mockProvider: sinon.SinonMock;

  const port = 90;
  const namespace = '/';

  @WebSocketGateway({ port, namespace })
  class Test {}

  beforeEach(() => {
    provider = new SocketServerProvider(null);
    mockProvider = sinon.mock(provider);
    target = new WebSocketsController(provider);
  });

  describe('hook', () => {
    let subscribeServer: sinon.SinonSpy;

    @WebSocketGateway(<any>{ port: 'test' })
    class InvalidGateway {}

    @WebSocketGateway()
    class DefaultGateway {}

    beforeEach(() => {
      subscribeServer = sinon.spy();
      target['subscribeServer'] = subscribeServer;
    });

    it('should throws "InvalidSocketPortException" when port is not a number', () => {
      expect(() => target.hook(new InvalidGateway(), InvalidGateway))
        .throws(InvalidServerSocketPortException);
    });

    it('should call "subscribeServer" with default values when metadata is empty', () => {
      const gateway = new DefaultGateway();

      target.hook(gateway, DefaultGateway);

      expect(subscribeServer.calledWith(gateway, '', 80)).to.be.true;
    });

    it('should call "subscribeServer" when metadata is valid', () => {
      const gateway = new Test();

      target.hook(gateway, Test);

      expect(subscribeServer.calledWith(gateway, namespace, port)).to.be.true;
    });
  });

  describe('subscribeServer', () => {
    let explorer: GatewayMetadataExplorer;
    let mockExplorer: sinon.SinonMock;
    let gateway: Test;
    let handlers: any;
    let server: any;
    let hook: sinon.SinonSpy;
    let subscribeEvents: sinon.SinonSpy;

    beforeEach(() => {
      gateway = new Test();
      explorer = new GatewayMetadataExplorer();
      mockExplorer = sinon.mock(explorer);
      target['explorer'] = explorer;

      handlers = ['test'];
      server = { server: 'test' };

      mockExplorer.expects('explore').returns(handlers);
      mockProvider.expects('scan').returns(server);

      hook = sinon.spy();
      subscribeEvents = sinon.spy();

      target['hook'] = hook;
      target['subscribeEvents'] = subscribeEvents;
    });

    it('should call "hook" with expected arguments', () => {
      target['subscribeServer'](gateway, namespace, port);

      expect(hook.calledWith(gateway, server.server));
    });

    it('should call "subscribeEvents" with expected arguments', () => {
      target['subscribeServer'](gateway, namespace, port);

      expect(subscribeEvents.calledWith(gateway, handlers, server));
    });
  });

  describe('subscribeEvents', () => {
    const gateway = new Test();

    let handlers: any;
    let server: any;
    let nextSpy: sinon.SinonSpy;
    let onSpy: sinon.SinonSpy;
    let subscribeInitEvent: sinon.SinonSpy;
    let getConnectionHandler: sinon.SinonSpy;

    beforeEach(() => {
      nextSpy = sinon.spy();
      onSpy = sinon.spy();
      subscribeInitEvent = sinon.spy();
      getConnectionHandler = sinon.spy();

      handlers = ['test'];
      server = {
        init: {
          next: nextSpy,
        },
        server: {
          on: onSpy,
          connection: {},
          disconnect: {},
        },
      };

      target['subscribeInitEvent'] = subscribeInitEvent;
      target['getConnectionHandler'] = getConnectionHandler;
    });

    it('should call "next" method of server object with expected argument', () => {
      target['subscribeEvents'](gateway, handlers, <any>server);

      expect(nextSpy.calledWith(server.server)).to.be.true;
    });

    it('should call "subscribeInitEvent" with expected arguments', () => {
      target['subscribeEvents'](gateway, handlers, <any>server);

      expect(subscribeInitEvent.calledWith(gateway, server.init)).to.be.true;
    });

    it('should bind connection handler to server', () => {
      target['subscribeEvents'](gateway, handlers, <any>server);

      expect(onSpy.calledWith('connection', getConnectionHandler())).to.be.true;
    });
    it('should call "getConnectionHandler" with expected arguments', () => {
      target['subscribeEvents'](gateway, handlers, server);

      expect(getConnectionHandler.calledWith(
        target,
        gateway,
        handlers,
        server.disconnect,
        server.connection
      )).to.be.true;
    });
  });

  describe('getConnectionHandler', () => {
    const gateway = new Test();

    let handlers: any;
    let fn: Function;
    let connection: any;
    let client: any
    let nextSpy: sinon.SinonSpy;
    let onSpy: sinon.SinonSpy;
    let subscribeMessages: sinon.SinonSpy;
    let subscribeDisconnectEvent: sinon.SinonSpy;
    let subscribeConnectionEvent: sinon.SinonSpy;

    beforeEach(() => {
      nextSpy = sinon.spy();
      onSpy = sinon.spy();
      subscribeMessages = sinon.spy();
      subscribeDisconnectEvent = sinon.spy();
      subscribeConnectionEvent = sinon.spy();

      handlers = ['test'];
      connection = {
        next: nextSpy
      };
      client = {
        on: onSpy,
      };
      target['subscribeDisconnectEvent'] = subscribeDisconnectEvent;
      target['subscribeConnectionEvent'] = subscribeConnectionEvent;
      target['subscribeMessages'] = subscribeMessages;

      fn = target['getConnectionHandler'](target, gateway, handlers, connection, null);
      fn(client);
    });

    it('should returns function', () => {
      expect(target['getConnectionHandler'](null, null, null, null, null)).to.be.a('function');
    });
    it('should call "subscribeConnectionEvent" with expected arguments', () => {
      expect(subscribeConnectionEvent.calledWith(gateway, connection)).to.be.true;
    });
    it('should call "next" method of connection object with expected argument', () => {
      expect(nextSpy.calledWith(client)).to.be.true;
    });
    it('should call "subscribeMessages" with expected arguments', () => {
      expect(subscribeMessages.calledWith(handlers, client, gateway)).to.be.true;
    });
    it('should call "subscribeDisconnectEvent" with expected arguments', () => {
      expect(subscribeDisconnectEvent.calledWith(gateway, null)).to.be.true;
    });
    it('should call "on" method of client object with expected arguments', () => {
      expect(onSpy.called).to.be.true;
    });
  });

  describe('subscribeInitEvent', () => {
    const gateway = new Test();
    let event, subscribe: sinon.SinonSpy;

    beforeEach(() => {
      subscribe = sinon.spy();
      event = { subscribe };
    });

    it('should not call subscribe method when "afterInit" method not exists', () => {
      target['subscribeInitEvent'](gateway, event);

      expect(subscribe.called).to.be.false;
    });
    it('should call subscribe method of event object with expected arguments when "afterInit" exists', () => {
      gateway['afterInit'] = () => {};
      target['subscribeInitEvent'](gateway, event);

      expect(subscribe.called).to.be.true;
    });
  });

  describe('subscribeConnectionEvent', () => {
    const gateway = new Test();
    let event, subscribe: sinon.SinonSpy;

    beforeEach(() => {
      subscribe = sinon.spy();
      event = { subscribe };
    });

    it('should not call subscribe method when "handleConnection" method not exists', () => {
      target['subscribeConnectionEvent'](gateway, event);

      expect(subscribe.called).to.be.false;
    });

    it('should call subscribe method of event object with expected arguments when "handleConnection" exists', () => {
      gateway['handleConnection'] = () => {};
      target['subscribeConnectionEvent'](gateway, event);

      expect(subscribe.called).to.be.true;
    });
  });

  describe('subscribeDisconnectEvent', () => {
    const gateway = new Test();
    let event, subscribe: sinon.SinonSpy;

    beforeEach(() => {
      subscribe = sinon.spy();
      event = { subscribe };
    });

    it('should not call subscribe method when "handleDisconnect" method not exists', () => {
      target['subscribeDisconnectEvent'](gateway, event);

      expect(subscribe.called).to.be.false;
    });

    it('should call subscribe method of event object with expected arguments when "handleDisconnect" exists', () => {
      gateway['handleDisconnect'] = () => {};
      target['subscribeDisconnectEvent'](gateway, event);

      expect(subscribe.called).to.be.true;
    });
  });

  describe('subscribeMessages', () => {
    const gateway = new Test();

    let client: any;
    let handlers: any;
    let onSpy: sinon.SinonSpy;

    beforeEach(() => {
      onSpy = sinon.spy();
      client = { on: onSpy };

      handlers = [
        { message: 'test', callback: { bind: () => 'testCallback' }},
        { message: 'test2', callback: { bind: () => 'testCallback2' }},
      ];
    });

    it('should bind each handler to client', () => {
      target['subscribeMessages'](handlers, client, gateway);

      expect(onSpy.calledTwice).to.be.true;
      expect(onSpy.calledWith('test', 'testCallback')).to.be.true;
      expect(onSpy.calledWith('test2', 'testCallback2')).to.be.true;
    });
  });
});
