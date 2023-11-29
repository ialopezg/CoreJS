import 'mocha';
import 'reflect-metadata';

import { expect } from 'chai';

import { Component } from '../../decorators';
import { DESIGN_PARAM_TYPES_METADATA } from '../../constants';

describe('@Component', () => {
  @Component()
  class TestComponent {
    constructor(numberValue: number, stringValue: string) {}
  }

  it(`should enhance transport with "${DESIGN_PARAM_TYPES_METADATA}" metadata`, () => {
    const params = Reflect.getMetadata(DESIGN_PARAM_TYPES_METADATA, TestComponent);

    expect(params[0]).to.be.eql(Number);
    expect(params[1]).to.be.eql(String);
  });
});
