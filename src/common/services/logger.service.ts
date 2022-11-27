import { ColorService as Color } from './color.service';

/**
 * Defines a service that logs messages.
 */
export class LoggerService {
  /**
   * Creates a new instance to the class LoggerService.
   *
   * @param context Application context to be used.
   */
  constructor(private readonly context: string) { }

  /**
   * Prints a log message into the current terminal console.
   *
   * @param message Message to be printed.
   */
  log(message: string) {
    this.logMessage(message, Color.green);
  }

  /**
   * Prints an error message into the current terminal console.
   *
   * @param message Message to be printed.
   * @param trace Tracing error details
   */
  error(message: string, trace: string) {
    this.logMessage(message, Color.red);
    this.printStackTrace(trace);
  }

  /**
   * Prints warn messages into the current terminal console.
   *
   * @param message Message to be printed.
   */
  warn(message: string) {
    this.logMessage(message, Color.yellow);
  }

  /**
   * Prints messages into the current terminal console with given parameters.
   *
   * @param message Message to be printed.
   * @param color Default text color.
   */
  private logMessage(message: string, color: Function) {
    process.stdout.write(color(`[CoreJS] ${process.pid}   - `));
    process.stdout.write(`${new Date(Date.now()).toLocaleString()}   `);
    process.stdout.write(Color.yellow(`[${this.context}] `));
    process.stdout.write(color(message));
    process.stdout.write('\n');
  }

  /**
   * Prints stack trace information into current console.
   *
   * @param trace Stack trace information to be printed.
   */
  private printStackTrace(trace: string) {
    process.stdout.write(trace);
    process.stdout.write('\n');
  }
}
