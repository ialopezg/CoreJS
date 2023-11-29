import { RuntimeException } from '../../errors';

export class InvalidMessageException extends RuntimeException {
  constructor() {
    super('Invalid message pattern or data!');
  }
}
