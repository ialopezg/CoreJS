import 'reflect-metadata';

import { expect } from 'chai';

import { SubscribeMessage } from '../../decorators';

describe('@SubscribeMessage', () => {
  class TestGateway {
    @SubscribeMessage({ value: 'filter' })
    static fn(): void {}
  }

  it('should decorate type with expected metadata', () => {
    const isMessageMapping = Reflect.getMetadata('__isMessageMapping', TestGateway.fn);
    const message = Reflect.getMetadata('message', TestGateway.fn);

    expect(isMessageMapping).to.be.true;
    expect(message).to.be.eql('filter');
  });
});
