import 'reflect-metadata';

import { expect } from 'chai';

import { SubscribeMessage } from '../../decorators';
import { MESSAGE_MAPPING_METADATA, MESSAGE_METADATA } from '../../constants';

describe('@SubscribeMessage', () => {
  class TestGateway {
    @SubscribeMessage({ value: 'filter' })
    static fn(): void {}
  }

  it('should decorate type with expected metadata', () => {
    const isMessageMapping = Reflect.getMetadata(MESSAGE_MAPPING_METADATA, TestGateway.fn);
    const message = Reflect.getMetadata(MESSAGE_METADATA, TestGateway.fn);

    expect(isMessageMapping).to.be.true;
    expect(message).to.be.eql('filter');
  });
});
