import { Color } from '@ialopezg/cli';
import { pad } from '@ialopezg/commonjs';

import { ApplicationMode } from '../enums/application-mode.enum';

declare var process;

/**
 * Logger Service.
 */
export class LoggerService {
  private static mode = ApplicationMode.RUN;

  /**
   * Creates a new instance of the LoggerService class with given context name.
   *
   * @param {string} context Context name.
   */
  constructor(private context: string) {}

  /**
   * Set current application execution context.
   *
   * @param {ApplicationMode} value Value to be set.
   */
  public static setMode(value: ApplicationMode) {
    this.mode = value;
  }

  /**
   * Prints an error message to the console.
   *
   * @param {string} message Message to write.
   * @param {string} trace Stack trace information.
   */
  public error(message: string, trace = ''): void {
    this.print(message, Color.red);
    this.printStack(trace);
  }

  /**
   * Prints an informative message to the console.
   *
   * @param {string} message Message to write.
   */
  public log(message: string): void {
    this.print(message);
  }

  /**
   * Prints an error message to the console.
   *
   * @param {string} message Message to write.
   */
  public warn(message: string): void {
    this.print(message, Color.yellow);
  }

  private print(message: string, color: Function = Color.green): void {
    if (LoggerService.mode === ApplicationMode.TEST) {
      return;
    }

    const pid = process.pid.toString();
    const date = new Date(Date.now()).toLocaleString();

    process.stdout.write(color(`[CoreJS] ${pad(pid,  pid.length + 1, 'RIGHT', ' ')}– `));
    process.stdout.write(`${pad(date, date.length + 2, 'RIGHT', ' ')}`);
    process.stdout.write(Color.yellow(`${pad(`[${this.context}]`, 21, 'RIGHT', ' ')}`));
    process.stdout.write(color(message));
    process.stdout.write('\n');
  }

  private printStack(trace: string): void {
    if (LoggerService.mode === ApplicationMode.TEST) {
      return;
    }

    process.stdout.write(trace);
    process.stdout.write('\n');
  }
}
