import { ColorService as color, RuntimeException } from '../common';

export class ExceptionHandler {
  static handle(error: RuntimeException | Error) {
    if (error instanceof RuntimeException) {
      console.log(color.red('[CoreJS] Runtime error!'));
      console.log(color.yellow(error.getMessage()));
    }
    console.log(color.bolder(color.red('Stack trace:')));
    console.log(error.stack);
  }
}
