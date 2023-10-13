import 'reflect-metadata';

import { expect } from 'chai';

import { RequestMapping } from '../../decorators';
import { RequestMethod } from '../../enums';
import { METHOD_METADATA, PATH_METADATA } from '../../constants';

describe('@RequestMapping', () => {
  const requestProps = {
    path: 'test',
    method: RequestMethod.ALL,
  };

  it('should decorate type with expected request metadata', () => {
    class TestController {
      @RequestMapping(requestProps)
      static test() {}
    }

    const path = Reflect.getMetadata(PATH_METADATA, TestController.test);
    const method = Reflect.getMetadata(METHOD_METADATA, TestController.test);

    expect(method).to.be.eql(requestProps.method);
    expect(path).to.be.eql(requestProps.path);
  });

  it('should set request method on GET by default', () => {
    class TestController {
      @RequestMapping({ path: '' })
      static test() {}
    }

    const method = Reflect.getMetadata(METHOD_METADATA, TestController.test);
    expect(method).to.be.eql(RequestMethod.GET);
  });

  it('should set path on "/" by default', () => {
    class TestController {
      @RequestMapping({})
      static test() {}
    }

    const path = Reflect.getMetadata(PATH_METADATA, TestController.test);
    console.log(path)
    expect(path).to.be.eql('/');
  });
});
