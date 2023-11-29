import { expect } from 'chai';
import * as sinon from 'sinon';

import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '../decorators';
import { GatewayMetadataExplorer } from '../explorer';

describe('GatewayMetadataExplorer', () => {
  const message = 'test';
  const secMessage = 'test2';

  @WebSocketGateway()
  class Test {
    @WebSocketServer() server;
    @WebSocketServer() anotherServer;

    get testGet() { return 0; }
    set testSet(value: any) {}

    constructor() {}

    @SubscribeMessage({ value: message })
    test() {}

    @SubscribeMessage({ value: secMessage })
    testSec() {}

    noMessage() {}
  }
  let target: GatewayMetadataExplorer;

  beforeEach(() => {
    target = new GatewayMetadataExplorer();
  });

  describe('explore', () => {
    let scanForHandlersFromPrototypes: sinon.SinonSpy;

    beforeEach(() => {
      scanForHandlersFromPrototypes = sinon.spy();
      target['scanForHandlersFromPrototypes'] = scanForHandlersFromPrototypes;
    });

    it('should call', () => {
      const test = new Test();
      target.explore(<any>test);

      expect(scanForHandlersFromPrototypes.calledWith(
        test,
        Object.getPrototypeOf(test),
      )).to.be.true;
    });
  });

  describe('exploreMetadata', () => {
    let test: Test;

    beforeEach(() => {
      test = new Test();
    });

    it('should return when "isMappingMetadata" is undefined', () => {
      const metadata = target['exploreMetadata'](
        <any>test,
        Object.getPrototypeOf(test),
        'noMessage',
      );

      expect(metadata).to.eq(null);
    });

    it('should return message mapping properties when "isMessageMapping" metadata is not undefined', () => {
      const metadata = target['exploreMetadata'](
        <any>test,
        Object.getPrototypeOf(test),
        'test',
      );

      expect(metadata).to.have.keys(['callback', 'message']);
      expect(metadata.message).to.eql(message);
    });
  });

  describe('scanForHandlersFromPrototypes', () => {
    it('should return only methods with pattern @MessagePattern decorator', () => {
      const test = new Test();
      const handlers = target['scanForHandlersFromPrototypes'](
        <any>test,
        Object.getPrototypeOf(test),
      );

      expect(handlers).to.have.length(2);
      expect(handlers[0].message).to.have.eq(message);
      expect(handlers[1].message).to.have.eq(secMessage);
    });
  });

  describe('scanForServerHooks', () => {
    it('should return properties with @Client decorator', () => {
      const test = new Test();
      const servers = [...target['scanForServerHooks'](<any>test)];

      expect(servers).to.have.length(2);
      expect(servers).to.deep.eq(['server', 'anotherServer']);
    });
  });
});
