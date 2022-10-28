import { expect } from 'chai';
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

      expect(Color.bgBlack(message)).to.be(bgBlack);
      expect(Color.bgRed(message)).to.be(bgRed);
      expect(Color.bgGreen(message)).to.be(bgGreen);
      expect(Color.bgYellow(message)).to.be(bgYellow);
      expect(Color.bgBlue(message)).to.be(bgBlue);
      expect(Color.bgMagenta(message)).to.be(bgMagenta);
      expect(Color.bgCyan(message)).to.be(bgCyan);
      expect(Color.bgWhite(message)).to.be(bgWhite);
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

      expect(Color.bgBrightBlack(message)).to.be(bgBrightBlack);
      expect(Color.bgBrightRed(message)).to.be(bgBrightRed);
      expect(Color.bgBrightGreen(message)).to.be(bgBrightGreen);
      expect(Color.bgBrightYellow(message)).to.be(bgBrightYellow);
      expect(Color.bgBrightBlue(message)).to.be(bgBrightBlue);
      expect(Color.bgBrightMagenta(message)).to.be(bgBrightMagenta);
      expect(Color.bgBrightCyan(message)).to.be(bgBrightCyan);
      expect(Color.bgBrightWhite(message)).to.be(bgBrightWhite);
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

      expect(Color.black(message)).to.be(black);
      expect(Color.red(message)).to.be(red);
      expect(Color.green(message)).to.be(green);
      expect(Color.yellow(message)).to.be(yellow);
      expect(Color.blue(message)).to.be(blue);
      expect(Color.magenta(message)).to.be(magenta);
      expect(Color.cyan(message)).to.be(cyan);
      expect(Color.white(message)).to.be(white);
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

      expect(Color.brightBlack(message)).to.be(brightBlack);
      expect(Color.brightRed(message)).to.be(brightRed);
      expect(Color.brightGreen(message)).to.be(brightGreen);
      expect(Color.brightYellow(message)).to.be(brightYellow);
      expect(Color.brightBlue(message)).to.be(brightBlue);
      expect(Color.brightMagenta(message)).to.be(brightMagenta);
      expect(Color.brightCyan(message)).to.be(brightCyan);
      expect(Color.brightWhite(message)).to.be(brightWhite);
    });
  });

  describe('Formats', () => {
    it('should reset all formats applied to the console', () => {
      const reset = utils.parseFormat();

      expect(Color.reset()).to.be(reset);
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

      expect(Color.bolder(message)).to.be(bold);
      expect(Color.dim(message)).to.be(dim);
      expect(Color.italic(message)).to.be(italic);
      expect(Color.underline(message)).to.be(underline);
      expect(Color.blink(message)).to.be(blink);
      expect(Color.inverse(message)).to.be(inverse);
      expect(Color.hidden(message)).to.be(hidden);
      expect(Color.strikeThrough(message)).to.be(strike);
    });
  });

  describe('Other formats', () => {
    it('should print a console text with combined formats', () => {
      const text = '\x1b[37mHello\x1b[39m \x1b[47mWorld!\x1b[49m from \x1b[33mCustomConsoleColors\x1b[39m';

      expect(
        `${Color.white('Hello')} ${Color.bgWhite('World!')} from ${Color.yellow(
          'CustomConsoleColors',
        )}`,
      ).to.be(text);
    });

    it('should print a formatted console text with chain of responsibility', () => {
      const text = 'Hello World!';

      expect(`${Color.bgWhite().black('Hello World!')}`).contain(text);
    });
  });
});
