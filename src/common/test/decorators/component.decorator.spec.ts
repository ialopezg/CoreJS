import 'mocha';
import 'reflect-metadata';

import { expect } from 'chai';

import { Component } from '../../decorators';
import { PARAM_TYPES_METADATA } from '../../constants';

describe('@Injectable', () => {
  @Component()
  class TestComponent {
    constructor(numberValue: number, stringValue: string) {}
  }

  it('should decorate type with "design:paramtypes" metadata', () => {
    const params = Reflect.getMetadata(PARAM_TYPES_METADATA, TestComponent);

    expect(params[0]).to.be.eql(Number);
    expect(params[1]).to.be.eql(String);
  });
});
