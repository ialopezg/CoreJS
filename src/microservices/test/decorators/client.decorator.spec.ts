import 'reflect-metadata';
import 'mocha';

import { expect } from 'chai';

import { Client } from '../../decorators';
import { CLIENT_CONFIGURATION_METADATA, CLIENT_METADATA } from '../../constants';

describe('@Client', () => {
  const pattern = { role: 'test' };

  class TestComponent {
    @Client(<any>pattern)
    static instance;
  }

  it('should enhance property with metadata', () => {
    const isClient = Reflect.getOwnMetadata(CLIENT_METADATA, TestComponent, 'instance');
    const config = Reflect.getOwnMetadata(
      CLIENT_CONFIGURATION_METADATA,
      TestComponent,
      'instance',
    );

    expect(isClient).to.be.true;
    expect(config).to.be.eql(pattern);
  });
});
