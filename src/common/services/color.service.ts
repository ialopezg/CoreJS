import { colorCodes, formatCodes } from '../constants';
import { parseFormat } from '../helpers';

/**
 * Represents an object that provide console colored and formatted texts.
 */
export class ColorService {
  private static readonly _styles = new Map<number, number[]>();

  /**
   * Black background.
   *
   * @param text Text to be shown.
   */
  static bgBlack = (text?: string): any =>
    this.parse(colorCodes.bgBlack, text);

  /**
   * Bright Black color.
   *
   * @param text Text to be shown.
   */
  static bgBrightBlack = (text?: string): any =>
    this.parse(colorCodes.bgBrightBlack, text);

  /**
   * Blue background.
   *
   * @param text Text to be shown.
   */
  static bgBlue = (text?: string): any => this.parse(colorCodes.bgBlue, text);

  /**
   * Blue Bright color.
   *
   * @param text Text to be shown.
   */
  static bgBrightBlue = (text?: string): any =>
    this.parse(colorCodes.bgBrightBlue, text);

  /**
   * Cyan background.
   *
   * @param text Text to be shown.
   */
  static bgCyan = (text?: string): any => this.parse(colorCodes.bgCyan, text);

  /**
   * Bright Cyan background.
   *
   * @param text Text to be shown.
   */
  static bgBrightCyan = (text?: string): any =>
    this.parse(colorCodes.bgBrightCyan, text);

  /**
   * Green background.
   *
   * @param text Text to be shown.
   */
  static bgGreen = (text?: string): any =>
    this.parse(colorCodes.bgGreen, text);

  /**
   * Bright Green background.
   *
   * @param text Text to be shown.
   */
  static bgBrightGreen = (text?: string): any =>
    this.parse(colorCodes.bgBrightGreen, text);

  /**
   * Magenta background.
   *
   * @param text Text to be shown.
   */
  static bgMagenta = (text?: string): any =>
    this.parse(colorCodes.bgMagenta, text);

  /**
   * Bright Magenta background.
   *
   * @param text Text to be shown.
   */
  static bgBrightMagenta = (text?: string): any =>
    this.parse(colorCodes.bgBrightMagenta, text);

  /**
   * Red background.
   *
   * @param text Text to be shown.
   */
  static bgRed = (text?: string): any => this.parse(colorCodes.bgRed, text);

  /**
   * Bright Red background.
   *
   * @param text Text to be shown.
   */
  static bgBrightRed = (text?: string): any =>
    this.parse(colorCodes.bgBrightRed, text);

  /**
   * Yellow background.
   *
   * @param text Text to be shown.
   */
  static bgYellow = (text?: string): any =>
    this.parse(colorCodes.bgYellow, text);

  /**
   * Bright Yellow background.
   *
   * @param text Text to be shown.
   */
  static bgBrightYellow = (text?: string): any =>
    this.parse(colorCodes.bgBrightYellow, text);

  /**
   * White background.
   *
   * @param text Text to be shown.
   */
  static bgWhite = (text?: string): any =>
    this.parse(colorCodes.bgWhite, text);

  /**
   * Bright White background.
   *
   * @param text Text to be shown.
   */
  static bgBrightWhite = (text?: string): any =>
    this.parse(colorCodes.bgBrightWhite, text);

  /**
   * Black color.
   *
   * @param text Text to be shown.
   */
  static black = (text?: string): any => this.parse(colorCodes.black, text);

  /**
   * Bright Black color.
   *
   * @param text Text to be shown.
   */
  static brightBlack = (text?: string): any =>
    this.parse(colorCodes.brightBlack, text);

  /**
   * Blue color.
   *
   * @param text Text to be shown.
   */
  static blue = (text?: string): any => this.parse(colorCodes.blue, text);

  /**
   * Bright Blue color.
   *
   * @param text Text to be shown.
   */
  static brightBlue = (text?: string): any =>
    this.parse(colorCodes.brightBlue, text);

  /**
   * Cyan color.
   *
   * @param text Text to be shown.
   */
  static cyan = (text?: string): any => this.parse(colorCodes.cyan, text);

  /**
   * Bright Cyan color.
   *
   * @param text Text to be shown.
   */
  static brightCyan = (text?: string): any =>
    this.parse(colorCodes.brightCyan, text);

  /**
   * Green color.
   *
   * @param text Text to be shown.
   */
  static green = (text?: string): any => this.parse(colorCodes.green, text);

  /**
   * Bright Green color.
   *
   * @param text Text to be shown.
   */
  static brightGreen = (text?: string): any =>
    this.parse(colorCodes.brightGreen, text);

  /**
   * Magenta color.
   *
   * @param text Text to be shown.
   */
  static magenta = (text?: string): any =>
    this.parse(colorCodes.magenta, text);

  /**
   * Bright Magenta color.
   *
   * @param text Text to be shown.
   */
  static brightMagenta = (text?: string): any =>
    this.parse(colorCodes.brightMagenta, text);

  /**
   * Red color.
   *
   * @param text Text to be shown.
   */
  static red = (text?: string): any => this.parse(colorCodes.red, text);

  /**
   * Bright Red color.
   *
   * @param text Text to be shown.
   */
  static brightRed = (text?: string): any =>
    this.parse(colorCodes.brightRred, text);

  /**
   * White color.
   *
   * @param text Text to be shown.
   */
  static white = (text?: string): any => this.parse(colorCodes.white, text);

  /**
   * Bright White color.
   *
   * @param text Text to be shown.
   */
  static brightWhite = (text?: string): any =>
    this.parse(colorCodes.brightWhite, text);

  /**
   * Yellow color.
   *
   * @param text Text to be shown.
   */
  static yellow = (text?: string): any => this.parse(colorCodes.yellow, text);

  /**
   * Bright Yellow color.
   *
   * @param text Text to be shown.
   */
  static brightYellow = (text?: string): any =>
    this.parse(colorCodes.brightYellow, text);

  /**
   * Bold text.
   *
   * @param text Text to be shown.
   */
  static bolder = (text?: string): any => this.parse(formatCodes.bold, text);

  /**
   * Dimmed text.
   *
   * @param text Text to be shown.
   */
  static dim = (text?: string): any => this.parse(formatCodes.dim, text);

  /**
   * Hidden text.
   *
   * @param text Text to be shown.
   */
  static hidden = (text?: string): any => this.parse(formatCodes.hidden, text);

  /**
   * Inverse text color.
   *
   * @param text Text to be shown.
   */
  static inverse = (text?: string): any =>
    this.parse(formatCodes.inverse, text);

  /**
   * Italic text.
   *
   * @param text Text to be shown.
   */
  static italic = (text?: string): any => this.parse(formatCodes.italic, text);

  /**
   * Strikethrough text.
   *
   * @param text Text to be shown.
   */
  static strikeThrough = (text?: string): any =>
    this.parse(formatCodes.strike, text);

  /**
   * Underlined text.
   *
   * @param text Text to be shown.
   */
  static underline = (text?: string): any =>
    this.parse(formatCodes.underline, text);

  /**
   * Blinked text.
   *
   * @param text Text to be shown.
   */
  static blink = (text?: string): any => this.parse(formatCodes.blink, text);

  /**
   * Clear current terminal console styles.
   */
  static reset = () => parseFormat();

  /**
   * Parse a text with ANSI colors or format styles.
   *
   * @param code Text to be shown.
   * @param message Text to be shown.
   *
   * @returns Text parsed.
   */
  static parse(code: any, message?: string): any {
    this._styles.set(code[0], code);
    if (message) {
      let result = message;
      this._styles.forEach((format: number[]) => {
        result = parseFormat(format, result);
      });
      this._styles.clear();

      return result;
    }

    return this;
  }
}
