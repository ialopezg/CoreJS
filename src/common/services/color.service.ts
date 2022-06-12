import { parseFormat } from '../utils';
import { colorCodes, formatCodes } from '../constants';

export class ColorService {
  private static readonly _styles = new Map<number, number[]>();

  static bgBlack = (text?: string): any =>
    this.parse(colorCodes.bgBlack, text);

  static bgBrightBlack = (text?: string): any =>
    this.parse(colorCodes.bgBrightBlack, text);

  static bgBlue = (text?: string): any => this.parse(colorCodes.bgBlue, text);

  static bgBrightBlue = (text?: string): any =>
    this.parse(colorCodes.bgBrightBlue, text);

  static bgCyan = (text?: string): any => this.parse(colorCodes.bgCyan, text);

  static bgBrightCyan = (text?: string): any =>
    this.parse(colorCodes.bgBrightCyan, text);

  static bgGreen = (text?: string): any =>
    this.parse(colorCodes.bgGreen, text);

  static bgBrightGreen = (text?: string): any =>
    this.parse(colorCodes.bgBrightGreen, text);

  static bgMagenta = (text?: string): any =>
    this.parse(colorCodes.bgMagenta, text);

  static bgBrightMagenta = (text?: string): any =>
    this.parse(colorCodes.bgBrightMagenta, text);

  static bgRed = (text?: string): any => this.parse(colorCodes.bgRed, text);

  static bgBrightRed = (text?: string): any =>
    this.parse(colorCodes.bgBrightRed, text);

  static bgYellow = (text?: string): any =>
    this.parse(colorCodes.bgYellow, text);

  static bgBrightYellow = (text?: string): any =>
    this.parse(colorCodes.bgBrightYellow, text);

  static bgWhite = (text?: string): any =>
    this.parse(colorCodes.bgWhite, text);

  static bgBrightWhite = (text?: string): any =>
    this.parse(colorCodes.bgBrightWhite, text);

  static black = (text?: string): any => this.parse(colorCodes.black, text);

  static brightBlack = (text?: string): any =>
    this.parse(colorCodes.brightBlack, text);

  static blue = (text?: string): any => this.parse(colorCodes.blue, text);

  static brightBlue = (text?: string): any =>
    this.parse(colorCodes.brightBlue, text);

  static cyan = (text?: string): any => this.parse(colorCodes.cyan, text);

  static brightCyan = (text?: string): any =>
    this.parse(colorCodes.brightCyan, text);

  static green = (text?: string): any => this.parse(colorCodes.green, text);

  static brightGreen = (text?: string): any =>
    this.parse(colorCodes.brightGreen, text);

  static magenta = (text?: string): any =>
    this.parse(colorCodes.magenta, text);

  static brightMagenta = (text?: string): any =>
    this.parse(colorCodes.brightMagenta, text);

  static red = (text?: string): any => this.parse(colorCodes.red, text);

  static brightRed = (text?: string): any =>
    this.parse(colorCodes.brightRred, text);

  static white = (text?: string): any => this.parse(colorCodes.white, text);

  static brightWhite = (text?: string): any =>
    this.parse(colorCodes.brightWhite, text);

  static yellow = (text?: string): any => this.parse(colorCodes.yellow, text);

  static brightYellow = (text?: string): any =>
    this.parse(colorCodes.brightYellow, text);

  static bolder = (text?: string): any => this.parse(formatCodes.bold, text);

  static dim = (text?: string): any => this.parse(formatCodes.dim, text);

  static hidden = (text?: string): any => this.parse(formatCodes.hidden, text);

  static inverse = (text?: string): any =>
    this.parse(formatCodes.inverse, text);

  static italic = (text?: string): any => this.parse(formatCodes.italic, text);

  static strikeThrough = (text?: string): any =>
    this.parse(formatCodes.strike, text);

  static underline = (text?: string): any =>
    this.parse(formatCodes.underline, text);

  static blink = (text?: string): any => this.parse(formatCodes.blink, text);

  static reset = () => parseFormat();

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
