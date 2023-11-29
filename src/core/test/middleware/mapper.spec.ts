import { expect } from 'chai';

import { Controller, RequestMapping, RequestMethod } from '../../../common';
import { RoutesMapper } from '../../middleware';
import { UnknownRequestMappingException } from '../../../errors';

describe('RoutesMapper', () => {
  @Controller({ path: 'test' })
  class TestRoute {
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
      middlewares: 'Test',
      forRoutes: [
        { path: 'test', method: RequestMethod.GET },
        TestRoute,
      ],
    };

    expect(mapper.map(config.forRoutes[0])).to.deep.equal([{
      path: '/test', method: RequestMethod.GET,
    }]);

    expect(mapper.map(config.forRoutes[1])).to.deep.equal([
      { path: '/test/test', method: RequestMethod.GET },
      { path: '/test/another', method: RequestMethod.DELETE },
    ]);
  });

  it('should throw exception when invalid object was passed as route', () => {
    const config = {
      middlewares: 'Test',
      forRoutes: [
        { method: RequestMethod.GET },
      ],
    };

    expect(
      mapper.map.bind(mapper, config.forRoutes[0]),
    ).throws(UnknownRequestMappingException);
  });
});
