import { RuntimeException } from '../../common/exceptions';
import { getUnkownExportMessage } from '../messages';

/**
 * Defines an error when exported dependencies as unknown or not declare in the module components list.
 */
export class UnknownExportException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor(name: string) {
    super(getUnkownExportMessage(name));
  }
}
