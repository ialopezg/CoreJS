import { expect } from 'chai';

import { InvalidPathVariableException } from '../../../errors/exceptions';
import { METHOD_METADATA, PATH_METADATA } from '../../constants';
import { RequestMapping } from '../../decorators';
import { RequestMethod } from '../../enums';
import { RequestMappingMetadata } from '../../interfaces';

describe('@RequestMapping', () => {
  const props: RequestMappingMetadata = {
    path: 'test',
    method: RequestMethod.ALL,
  };

  it('should enhance transport with expected request metadata', () => {
    class Test {
      @RequestMapping(props)
      static test() {}
    }

    const path = Reflect.getMetadata(PATH_METADATA, Test.test);
    const method = Reflect.getMetadata(METHOD_METADATA, Test.test);

    expect(method).to.be.eql(props.method);
    expect(path).to.be.eql(props.path);
  });

  it('should set request method on GET by default', () => {
    class Test {
      @RequestMapping({ path: '' })
      static test() {}
    }

    const method = Reflect.getMetadata(METHOD_METADATA, Test.test);

    expect(method).to.be.eql(RequestMethod.GET);
  });

  it('should set path on "/" by default', () => {
    class Test {
      @RequestMapping({})
      static test() {}
    }

    const method = Reflect.getMetadata(PATH_METADATA, Test.test);

    expect(method).to.be.eql('/');
  });
});
