import { RuntimeException } from '../../common/exceptions/runtime.exception';

export class InvalidModuleConfigurationException extends RuntimeException {
  constructor(property: string) {
    super(`Invalid property [${property}] in @Module({}) annotation!`);
  }
}
