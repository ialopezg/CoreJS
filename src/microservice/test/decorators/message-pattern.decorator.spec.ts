import { MessagePattern } from '../../decorators';
import { CLIENT_CONFIGURATION_METADATA, CLIENT_METADATA, PATTERN_METADATA } from '../../constants';
import { expect } from 'chai';

describe('@MessagePattern', () => {
  const pattern = { role: 'test' };

  class TestComponent {
    @MessagePattern(pattern)
    static test() {}
  }

  it('should enhance property with metadata', () => {
    const metadata = Reflect.getOwnMetadata(PATTERN_METADATA, TestComponent.test);

    expect(metadata).to.be.eql(pattern);
  });
});
