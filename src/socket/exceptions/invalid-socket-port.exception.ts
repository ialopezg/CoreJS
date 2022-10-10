import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when the Gateway port is invalid.
 */
export class InvalidSocketPortException extends RuntimeException {
  /**
   * Creates a new instance of this instance.
   *
   * @param port Invalid port.
   * @param target Gateway object that throws the error.
   */
  constructor(port: number, target: any) {
    super(`Invalid port ${port} in Gateway ${target.name}!`);
  }
}
