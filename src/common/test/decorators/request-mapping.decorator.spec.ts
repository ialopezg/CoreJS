import 'reflect-metadata';

import { expect } from 'chai';

import { RequestMapping } from '../../decorators';
import { RequestMethod } from '../../enums';
import { InvalidRequestMappingPathException } from '../../../errors';

describe('@RequestMapping', () => {
  const requestProps = {
    path: 'test',
    method: RequestMethod.ALL,
  };

  it('should decorate type with expected request metadata', () => {
    class TestController {
      @RequestMapping(requestProps)
      static test() {
      }
    }

    const path = Reflect.getMetadata('path', TestController.test);
    const method = Reflect.getMetadata('method', TestController.test);

    expect(method).to.be.eql(requestProps.method);
    expect(path).to.be.eql(requestProps.path);
  });

  it('should set request method on GET by default', () => {
    class TestController {
      @RequestMapping({ path: '' })
      static test() {}
    }

    const method = Reflect.getMetadata('method', TestController.test);
    expect(method).to.be.eql(RequestMethod.GET);
  });

  it('should throw exception when path variable is not set', () => {
    expect(RequestMapping.bind(null, {})).throw(InvalidRequestMappingPathException);
  });
});
