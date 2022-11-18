import { RuntimeException } from '../../common/exceptions';

export class InvalidPathVariableException extends RuntimeException {
  constructor(annotationName: string) {
    super(`Invalid path in @${annotationName}!`);
  }
}
