import * as sinon from 'sinon';
import { expect } from 'chai';

import { ListenersController } from '../controller';
import { ListenerMetadataExplorer } from '../explorer';

describe('ListenersController', () => {
  let instance: ListenersController;
  let explorer: sinon.SinonMock;
  let metadataExplorer: ListenerMetadataExplorer;
  let server: any;
  let addSpy: sinon.SinonSpy;

  before(() => {
    metadataExplorer = new ListenerMetadataExplorer();
    explorer = sinon.mock(metadataExplorer);
  });

  beforeEach(() => {
    instance = new ListenersController();
    // eslint-disable-next-line dot-notation
    (<any>instance)['explorer'] = metadataExplorer;
    addSpy = sinon.spy();
    server = {
      add: addSpy,
    };
  });

  describe('bindPatternHandlers', () => {
    it('should call add method of server for each pattern handler', () => {
      const handlers = [
        {
          pattern: 'test',
          callback: 'tt',
        },
        {
          pattern: 'test2',
          callback: '2',
        },
      ];

      explorer.expects('explore').returns(handlers);
      instance.bindPatternHandlers(null, server);

      expect(addSpy.calledTwice).to.be.true;
      expect(addSpy.calledWith(handlers[0].pattern, handlers[0].callback)).to.be.true;
      expect(addSpy.calledWith(handlers[1].pattern, handlers[1].callback)).to.be.true;
    });
  });
});
