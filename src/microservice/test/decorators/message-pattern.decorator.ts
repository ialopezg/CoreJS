import 'reflect-metadata';

import { expect } from 'chai';

import { MESSAGE_PATTERN_METADATA } from '../../constants';
import { MessagePattern } from '../../decorators';

describe('@MessagePattern', () => {
  const pattern = { role: 'test' };

  class TestComponent {
    @MessagePattern(pattern)
    static test() {}
  }

  it(`should enhance method with ${MESSAGE_PATTERN_METADATA} metadata`, () => {
    const metadata = Reflect.getMetadata(
      MESSAGE_PATTERN_METADATA,
      TestComponent.test,
    );

    expect(metadata).to.be.eql(pattern);
  });
});
