import { expect } from 'chai';
import { InvalidPathVariableException } from '../../../errors';
import { RequestMapping } from '../../decorators';
import { RequestMethod } from '../../enums';
import { RequestMappingMetadata } from '../../interfaces';

describe('@RequestMapping', () => {
  const metadata: RequestMappingMetadata = {
    path: 'test',
    method: RequestMethod.ALL,
  };

  it('should decorate type with expected request metadata', () => {
    class Test {
      @RequestMapping(metadata)
      static test() {}
    }

    const path = Reflect.getMetadata('path', Test.test);
    const method = Reflect.getMetadata('method', Test.test);

    expect(method).to.be.eql(metadata.method);
    expect(path).to.be.eql(metadata.path);
  });

  it('should set request method on GET by default', () => {
    class Test {
      @RequestMapping({ path: '' })
      static test() {}
    }

    const method = Reflect.getMetadata('method', Test.test);

    expect(method).to.be.eql(RequestMethod.GET);
  });

  it('should throw exception when path variable is not set', () => {
    expect(RequestMapping.bind(null, {})).to.throw(InvalidPathVariableException);
  });
});
