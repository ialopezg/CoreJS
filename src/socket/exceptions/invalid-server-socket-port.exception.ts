import { RuntimeException } from '../../errors';

/**
 * Defines an error when the Gateway port is invalid.
 */
export class InvalidServerSocketPortException extends RuntimeException {
  /**
   * Creates a new instance of this instance.
   *
   * @param {number} port Invalid port.
   * @param {string} target Gateway object that throws the error.
   */
  constructor(port: number, target: string) {
    super(`Invalid port ${port} in Gateway ${target}!`);
  }
}
