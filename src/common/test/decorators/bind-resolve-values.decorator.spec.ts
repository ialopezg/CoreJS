import 'mocha';
import 'reflect-metadata';

import { expect } from 'chai';

import { BindResolveValues } from "../../decorators";
import { IMiddleware } from "../../../core";

describe('BindResolveValues', () => {
  let type: any;
  const arg1 = 3;
  const arg2 = 4;

  class Test implements IMiddleware {
    resolve(a: unknown, b: unknown) {
      return () => [a, b];
    }
  }

  beforeEach(() => {
    type = BindResolveValues([arg1, arg2])(Test);
  });

  it('should pass values to resolve method', () => {
    const obj = new type();
    const hof = obj.resolve();

    expect(hof()).to.deep.equal([arg1, arg2]);
  });

  it('should set name of meta type', () => {
    expect(type.name).to.eq((<any>Test).name + JSON.stringify([arg1, arg2]));
  });
});
