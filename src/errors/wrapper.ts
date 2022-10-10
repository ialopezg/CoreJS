import { ExceptionHandler } from './handler';

export class ExceptionWrapper {
  public static run(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
