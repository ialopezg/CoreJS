import { expect } from 'chai';

import { InvalidMiddlewareConfigurationException } from '../../../errors';
import { MiddlewareBuilder, MiddlewareConfigProxy } from '../../middleware';

describe('MiddlewareBuilder', () => {
  let builder: MiddlewareBuilder;

  beforeEach(() => {
    builder = new MiddlewareBuilder();
  });

  describe('apply', () => {
    let configProxy: MiddlewareConfigProxy;

    beforeEach(() => {
      configProxy = builder.apply([]);
    });

    it('should return configuration proxy', () => {
      expect(configProxy).to.have.keys("with", "forRoutes");
    });

    describe('configuration proxy', () => {
      it('should return itself on "with()" call', () => {
        expect(configProxy.with()).to.be.eq(configProxy);
      });

      describe('when "forRoutes()" called', () => {
        class Test {}

        it('should throws "InvalidMiddlewareConfigurationException" when passed argument is undefined', () => {
          expect(() => configProxy.forRoutes(undefined)).to.throws(
            InvalidMiddlewareConfigurationException
          );
        });

        it('should store configuration passed as argument', () => {
          configProxy.forRoutes(Test);

          expect(builder.build()).to.deep.equal([{
            middlewares: [],
            forRoutes: [Test]
          }]);
        });
      });
    });
  });

  describe('use', () => {
    it('should store configuration passed as argument', () => {
      builder.use(<any>{
        middlewares: 'Test',
        forRoutes: 'Test',
      });

      expect(builder.build()).to.deep.equal([{
          middlewares: 'Test',
          forRoutes: 'Test',
      }]);
    });

    it('should be possible to chain "use" calls', () => {
      builder
        .use(<any>{
          middlewares: 'Test',
          forRoutes: 'Test',
        })
        .use(<any>{
          middlewares: 'Test',
          forRoutes: 'Test',
        });

      expect(builder.build()).to.deep.equal([
        <any>{
          middlewares: 'Test',
          forRoutes: 'Test'
        },
        <any>{
          middlewares: 'Test',
          forRoutes: 'Test'
        }
      ]);
    });

    it('should throw exception when middleware configuration object is invalid', () => {
      expect(builder.use.bind(builder, 'test')).throws(
        InvalidMiddlewareConfigurationException
      );
    });
  });
});
