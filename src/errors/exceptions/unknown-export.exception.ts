import { RuntimeException } from '../../common/exceptions/runtime.exception';

export class UnknownExportException extends RuntimeException {
  constructor() {
    super('You are trying to export unknown component. Maybe ' +
      'you forgot to place this one to components list also.');
  }
}
