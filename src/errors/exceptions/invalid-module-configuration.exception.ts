import { RuntimeException } from '../../common/exceptions';
import { getInvalidModuleConfigurationMessage } from '../messages';

export class InvalidModuleConfigurationException extends RuntimeException {
  constructor(property: string) {
    super(getInvalidModuleConfigurationMessage(property));
  }
}
