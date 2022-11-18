import { expect } from 'chai';

import { MiddlewareBuilder } from '../../middleware';
import { InvalidMiddlewareConfigurationException } from '../../../errors/exceptions';

describe('MiddlewareBuilder', () => {
  let builder: MiddlewareBuilder;

  beforeEach(() => {
    builder = new MiddlewareBuilder();
  });

  it('should store configuration passed as argument', () => {
    builder.use(<any>{
      middlewares: 'TestMiddleware',
      forRoutes: 'TestMiddleware'
    });

    expect(builder.build()).to.deep.equal([{
      middlewares: 'TestMiddleware',
      forRoutes: 'TestMiddleware'
    }]);
  });

  it('should be possible to chain "use" calls', () => {
    builder.use(<any>{
      middlewares: 'TestMiddleware',
      forRoutes: 'TestMiddleware'
    }).use(<any>{
      middlewares: 'TestMiddleware',
      forRoutes: 'TestMiddleware'
    });

    expect(builder.build()).to.deep.equal([<any>{
      middlewares: 'TestMiddleware',
      forRoutes: 'TestMiddleware'
    }, <any>{
      middlewares: 'TestMiddleware',
      forRoutes: 'TestMiddleware'
    }]);
  });

  it('should throw exception when middleware configuration object is invalid', () => {
    expect(builder.use.bind(builder, 'test')).throws(InvalidMiddlewareConfigurationException);
  });
});
