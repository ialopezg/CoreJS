import { ColorService as Color } from '../../services';
import * as utils from '../../utils';

describe('Color', () => {
  let message: string;

  beforeEach(() => {
    message = 'Hello World!';
  });

  describe('Colors', () => {
    it('should print console texts with all available background colors', () => {
      const bgBlack = `\x1b[40m${message}\x1b[49m`;
      const bgRed = `\x1b[41m${message}\x1b[49m`;
      const bgGreen = `\x1b[42m${message}\x1b[49m`;
      const bgYellow = `\x1b[43m${message}\x1b[49m`;
      const bgBlue = `\x1b[44m${message}\x1b[49m`;
      const bgMagenta = `\x1b[45m${message}\x1b[49m`;
      const bgCyan = `\x1b[46m${message}\x1b[49m`;
      const bgWhite = `\x1b[47m${message}\x1b[49m`;

      expect(Color.bgBlack(message)).toBe(bgBlack);
      expect(Color.bgRed(message)).toBe(bgRed);
      expect(Color.bgGreen(message)).toBe(bgGreen);
      expect(Color.bgYellow(message)).toBe(bgYellow);
      expect(Color.bgBlue(message)).toBe(bgBlue);
      expect(Color.bgMagenta(message)).toBe(bgMagenta);
      expect(Color.bgCyan(message)).toBe(bgCyan);
      expect(Color.bgWhite(message)).toBe(bgWhite);
    });

    it('should print console texts with all available bright background colors', () => {
      const bgBrightBlack = utils.parseFormat([100, 49], message);
      const bgBrightRed = utils.parseFormat([101, 49], message);
      const bgBrightGreen = utils.parseFormat([102, 49], message);
      const bgBrightYellow = utils.parseFormat([103, 49], message);
      const bgBrightBlue = utils.parseFormat([104, 49], message);
      const bgBrightMagenta = utils.parseFormat([105, 49], message);
      const bgBrightCyan = utils.parseFormat([106, 49], message);
      const bgBrightWhite = utils.parseFormat([107, 49], message);

      expect(Color.bgBrightBlack(message)).toBe(bgBrightBlack);
      expect(Color.bgBrightRed(message)).toBe(bgBrightRed);
      expect(Color.bgBrightGreen(message)).toBe(bgBrightGreen);
      expect(Color.bgBrightYellow(message)).toBe(bgBrightYellow);
      expect(Color.bgBrightBlue(message)).toBe(bgBrightBlue);
      expect(Color.bgBrightMagenta(message)).toBe(bgBrightMagenta);
      expect(Color.bgBrightCyan(message)).toBe(bgBrightCyan);
      expect(Color.bgBrightWhite(message)).toBe(bgBrightWhite);
    });

    it('should print a console texts with all available foreground colors', () => {
      const black = utils.parseFormat([30, 39], message);
      const red = utils.parseFormat([31, 39], message);
      const green = utils.parseFormat([32, 39], message);
      const yellow = utils.parseFormat([33, 39], message);
      const blue = utils.parseFormat([34, 39], message);
      const magenta = utils.parseFormat([35, 39], message);
      const cyan = utils.parseFormat([36, 39], message);
      const white = utils.parseFormat([37, 39], message);

      expect(Color.black(message)).toBe(black);
      expect(Color.red(message)).toBe(red);
      expect(Color.green(message)).toBe(green);
      expect(Color.yellow(message)).toBe(yellow);
      expect(Color.blue(message)).toBe(blue);
      expect(Color.magenta(message)).toBe(magenta);
      expect(Color.cyan(message)).toBe(cyan);
      expect(Color.white(message)).toBe(white);
    });

    it('should print a console texts with all available bright colors', () => {
      const brightBlack = utils.parseFormat([90, 39], message);
      const brightRed = utils.parseFormat([91, 39], message);
      const brightGreen = utils.parseFormat([92, 39], message);
      const brightYellow = utils.parseFormat([93, 39], message);
      const brightBlue = utils.parseFormat([94, 39], message);
      const brightMagenta = utils.parseFormat([95, 39], message);
      const brightCyan = utils.parseFormat([96, 39], message);
      const brightWhite = utils.parseFormat([97, 39], message);

      expect(Color.brightBlack(message)).toBe(brightBlack);
      expect(Color.brightRed(message)).toBe(brightRed);
      expect(Color.brightGreen(message)).toBe(brightGreen);
      expect(Color.brightYellow(message)).toBe(brightYellow);
      expect(Color.brightBlue(message)).toBe(brightBlue);
      expect(Color.brightMagenta(message)).toBe(brightMagenta);
      expect(Color.brightCyan(message)).toBe(brightCyan);
      expect(Color.brightWhite(message)).toBe(brightWhite);
    });
  });

  describe('Formats', () => {
    it('should reset all formats applied to the console', () => {
      const reset = utils.parseFormat();

      expect(Color.reset()).toBe(reset);
    });

    it('should print a hidden console text', () => {
      const bold = utils.parseFormat([1, 22], message);
      const dim = utils.parseFormat([2, 22], message);
      const italic = utils.parseFormat([3, 23], message);
      const underline = utils.parseFormat([4, 24], message);
      const blink = utils.parseFormat([5, 25], message);
      const inverse = utils.parseFormat([7, 27], message);
      const hidden = utils.parseFormat([8, 28], message);
      const strike = utils.parseFormat([9, 29], message);

      expect(Color.bolder(message)).toBe(bold);
      expect(Color.dim(message)).toBe(dim);
      expect(Color.italic(message)).toBe(italic);
      expect(Color.underline(message)).toBe(underline);
      expect(Color.blink(message)).toBe(blink);
      expect(Color.inverse(message)).toBe(inverse);
      expect(Color.hidden(message)).toBe(hidden);
      expect(Color.strikeThrough(message)).toBe(strike);
    });
  });

  describe('Other formats', () => {
    it('should print a console text with combined formats', () => {
      const text = `\x1b[37mHello\x1b[39m \x1b[47mWorld!\x1b[49m from \x1b[33mCustomConsoleColors\x1b[39m`;

      expect(
        `${Color.white('Hello')} ${Color.bgWhite('World!')} from ${Color.yellow(
          'CustomConsoleColors',
        )}`,
      ).toBe(text);
    });

    it('should print a formatted console text with chain of responsibility', () => {
      const text = 'Hello World!';

      expect(`${Color.bgWhite().black('Hello World!')}`).toContain(text);
    });
  });
});
