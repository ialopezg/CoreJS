import 'mocha';
import 'reflect-metadata';

import { expect } from 'chai';
import { PARAM_TYPES_METADATA } from '../../constants';

import { Component } from '../../decorators';

describe('@Component', () => {
  @Component()
  class TestComponent {
    constructor(_number: number, _text: string) {}
  }

  it('should decorate type with "design:paramtypes" metadata', () => {
    const params = Reflect.getMetadata(PARAM_TYPES_METADATA, TestComponent);

    expect(params[0]).to.be.eql(Number);
    expect(params[1]).to.be.eql(String);
  });
});
