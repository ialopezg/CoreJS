import * as sinon from 'sinon';
import { expect } from 'chai';
import { ListenerMetadataExplorer } from '../explorer';
import { ListenerController } from '../controller';

describe('ListenersController', () => {
  let instance: ListenerController,
    explorer: sinon.SinonMock,
    metadataExplorer: ListenerMetadataExplorer,
    server,
    addSpy: sinon.SinonSpy;

  before(() => {
    metadataExplorer = new ListenerMetadataExplorer();
    explorer = sinon.mock(metadataExplorer);
  });
  beforeEach(() => {
    instance = new ListenerController();
    (<any>instance)['explorer'] = metadataExplorer;
    addSpy = sinon.spy();
    server = {
      add: addSpy
    }
  });

  describe('bindPatternHandlers', () => {
    it(`should call add method of server for each pattern handler`, () => {
      const handlers = [
        { pattern: 'test', callback: 'tt' },
        { pattern: 'test2', callback: '2' }
      ];
      explorer.expects('explore').returns(handlers);

      instance.bindHandlers(null, server);

      expect(addSpy.calledTwice).to.be.true;
      expect(addSpy.calledWith(handlers[0].pattern, handlers[0].callback)).to.be.true;
      expect(addSpy.calledWith(handlers[1].pattern, handlers[1].callback)).to.be.true;
    });
  });
});
