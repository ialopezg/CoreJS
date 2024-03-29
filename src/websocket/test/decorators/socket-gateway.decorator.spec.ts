import 'reflect-metadata';

import { expect } from 'chai';

import { WebSocketGateway } from '../../decorators';
import {
  GATEWAY_METADATA,
  NAMESPACE_METADATA,
  PORT_METADATA,
} from '../../constants';

describe('@WebSocketGateway', () => {
  @WebSocketGateway({ port: 80, namespace: '/' })
  class TestGateway {}

  it('should decorate transport with expected metadata', () => {
    const isGateway = Reflect.getMetadata(GATEWAY_METADATA, TestGateway);
    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, TestGateway);
    const port = Reflect.getMetadata(PORT_METADATA, TestGateway);

    expect(isGateway).to.be.eql(true);
    expect(port).to.be.eql(80);
    expect(namespace).to.be.eql('/');
  });
});
