import { RuntimeException } from '../../common/exceptions/runtime.exception';

export class InvalidPathVariableException extends RuntimeException {
  constructor(annotationName: string) {
    super(`Invalid path in @${annotationName}!`);
  }
}
