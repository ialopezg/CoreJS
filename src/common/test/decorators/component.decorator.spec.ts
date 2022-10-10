import 'reflect-metadata';

import { expect } from 'chai';

import { Component } from '../../decorators';

describe('@Component', () => {
  @Component()
  class TestComponent {
    constructor(number: number, text: string) {}
  }

  it('should decorate type with "design:paramtypes" metadata', () => {
    const params = Reflect.getMetadata('design:paramtypes', TestComponent);

    expect(params[0]).to.be.eql(Number);
    expect(params[1]).to.be.eql(String);
  });
});
