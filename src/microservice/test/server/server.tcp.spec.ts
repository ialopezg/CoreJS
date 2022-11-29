/* eslint-disable dot-notation */
import * as sinon from 'sinon';
import { expect } from 'chai';

import { ServerTCP } from '../../server';
import { NO_PATTERN_MESSAGE } from '../../constants';

describe('ServerTCP', () => {
  let server: ServerTCP;
  beforeEach(() => {
    server = new ServerTCP({});
  });

  describe('bindHandler', () => {
    let getSocketInstance;
    const socket = { on: sinon.spy() };

    beforeEach(() => {
      getSocketInstance = sinon.stub(server, 'getSocketInstance').callsFake(() => socket);
    });

    it('should bind message event to handler', () => {
      server.bindHandler(null);

      expect(socket.on.called).to.be.true;
    });
  });
  describe('listen', () => {
    const serverMock = { listen: sinon.spy() };

    beforeEach(() => {
      server['server'] = <any>serverMock;
    });

    it('should call native listen method with expected arguments', () => {
      const callback = () => {};
      server.listen(callback);

      expect(serverMock.listen.calledWith(server['port'], callback)).to.be.true;
    });
  });

  describe('handleMessage', () => {
    let socket;
    const msg = {
      pattern: 'test',
      data: 'tests',
    };

    beforeEach(() => {
      socket = {
        sendMessage: sinon.spy(),
      };
    });

    it('should send NO_PATTERN_MESSAGE error if key is not exists in handlers object', () => {
      server.handleMessage(socket, msg);

      expect(socket.sendMessage.calledWith({ error: NO_PATTERN_MESSAGE })).to.be.true;
    });

    it('should call handler if exists in handlers object', () => {
      const handler = sinon.spy();
      (<any>server)['messageHandlers'] = {
        [JSON.stringify(msg.pattern)]: handler,
      };

      server.handleMessage(socket, msg);

      expect(handler.calledOnce).to.be.true;
    });
  });

  describe('getMessageHandler', () => {
    let handler;
    const sendMessage = sinon.spy();
    const socket = { sendMessage };

    beforeEach(() => {
      handler = server.getMessageHandler(socket);
    });

    it('should return function', () => {
      expect(typeof server.getMessageHandler(null)).to.be.eql('function');
    });

    it('should change order when second parameter is undefined or null', () => {
      const response = 'test';
      handler(response);

      expect(sendMessage.calledWith({ error: null, response })).to.be.true;
    });

    it('should call "sendMessage" with expected message object', () => {
      const error = 'err';
      const response = 'test';
      handler(error, response);

      expect(sendMessage.calledWith({ error, response })).to.be.true;
    });
  });
});
