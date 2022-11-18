import { expect } from 'chai';

import { RoutesMapper } from '../../middleware';
import { Controller, RequestMapping, RequestMethod } from '../../../common';
import { UnknownRequestMappingException } from '../../../errors/exceptions';

describe('RoutesMapper', () => {
  @Controller({ path: 'test' })
  class TestController {
    @RequestMapping({ path: 'test' })
    getTest() {}

    @RequestMapping({ path: 'another', method: RequestMethod.DELETE })
    getAnother() {}
  }

  let mapper: RoutesMapper;

  beforeEach(() => {
    mapper = new RoutesMapper();
  });

  it('should map @Controller() to "ControllerMetadata" in forRoutes', () => {
    const config = {
      middlewares: 'TestMiddleware',
      forRoutes: [
        { path: 'test', method: RequestMethod.GET },
        TestController,
      ],
    };

    expect(mapper.mapControllerToControllerMetadata(config.forRoutes[0])).to.deep.equal([{
      path: '/test',
      method: RequestMethod.GET,
    }]);
    expect(mapper.mapControllerToControllerMetadata(config.forRoutes[1])).to.deep.equal([
      { path: '/test/test', method: RequestMethod.GET },
      { path: '/test/another', method: RequestMethod.DELETE },
    ]);
  });

  it('should throw exception when invalid object was passed as route', () => {
    const config = {
      middlewares: 'TestMiddleware',
      forRoutes: [
        { method: RequestMethod.GET },
      ],
    };

    expect(
      mapper.mapControllerToControllerMetadata.bind(mapper, config.forRoutes[0]),
    ).throws(UnknownRequestMappingException);
  });
});
