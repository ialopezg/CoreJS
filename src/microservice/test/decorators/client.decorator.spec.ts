import { expect } from 'chai';

import { Transport } from '../../../common';
import { CLIENT_CONFIGURATION_METADATA, CLIENT_METADATA } from '../../constants';
import { Client } from '../../decorators';

describe('@Client', () => {
  const pattern = { transport: Transport.TCP, port: 5667 };

  class TestComponent {
    @Client(pattern)
    static instance: any;
  }

  it('should enhance property with metadata', () => {
    const isClient = Reflect.getMetadata(CLIENT_METADATA, TestComponent, 'instance');
    const config = Reflect.getMetadata(CLIENT_CONFIGURATION_METADATA, TestComponent, 'instance');

    expect(isClient).to.be.true;
    expect(config).to.be.eql(pattern);
  });
});
