import { expect } from 'chai';
import * as sinon from 'sinon';

import { ColorService as Color, parseFormat } from '../../../../src';

describe('ColorService', () => {
  let message: string;

  beforeEach(() => {
    message = 'Hello World!';
  });

  describe('parse', () => {
    let parseSpy: sinon.SinonSpy;
    // .mockImplementation((code, message) => parseFormat(code, message));

    beforeEach(() => {
      parseSpy = sinon.spy(Color, 'parse');
    });

    it('should "parse" to have been called', () => {
      Color.parse([1, 22]);
      Color.parse([1, 22], message);
      Color.green(message);

      expect(parseSpy.callCount).to.be.eql(3);
    });
  });

  describe('ansi', () => {
    it('should print console texts with all available background colors', () => {
      const bgRed = `\x1b[41m${message}\x1b[49m`;
      const bgGreen = `\x1b[42m${message}\x1b[49m`;
      const bgYellow = `\x1b[43m${message}\x1b[49m`;
      const bgBlue = `\x1b[44m${message}\x1b[49m`;
      const bgMagenta = `\x1b[45m${message}\x1b[49m`;
      const bgCyan = `\x1b[46m${message}\x1b[49m`;
      const bgWhite = `\x1b[47m${message}\x1b[49m`;

      expect(Color.reset()).to.not.contain(message);
      expect(Color.bolder(Color.green(message))).to.contain(message);
      expect(Color.bgBlack(message)).to.contain(message);
      expect(Color.bgRed(message)).to.be.eql(bgRed);
      expect(Color.bgGreen(message)).to.be.eql(bgGreen);
      expect(Color.bgYellow(message)).to.be.eql(bgYellow);
      expect(Color.bgBlue(message)).to.be.eql(bgBlue);
      expect(Color.bgMagenta(message)).to.be.eql(bgMagenta);
      expect(Color.bgCyan(message)).to.be.eql(bgCyan);
      expect(Color.bgWhite(message)).to.be.eql(bgWhite);
    });

    it('should print console texts with all available bright background colors', () => {
      const bgBrightBlack = parseFormat([100, 49], message);
      const bgBrightRed = parseFormat([101, 49], message);
      const bgBrightGreen = parseFormat([102, 49], message);
      const bgBrightYellow = parseFormat([103, 49], message);
      const bgBrightBlue = parseFormat([104, 49], message);
      const bgBrightMagenta = parseFormat([105, 49], message);
      const bgBrightCyan = parseFormat([106, 49], message);
      const bgBrightWhite = parseFormat([107, 49], message);

      expect(Color.bgBrightBlack(message)).to.be.eql(bgBrightBlack);
      expect(Color.bgBrightRed(message)).to.be.eql(bgBrightRed);
      expect(Color.bgBrightGreen(message)).to.be.eql(bgBrightGreen);
      expect(Color.bgBrightYellow(message)).to.be.eql(bgBrightYellow);
      expect(Color.bgBrightBlue(message)).to.be.eql(bgBrightBlue);
      expect(Color.bgBrightMagenta(message)).to.be.eql(bgBrightMagenta);
      expect(Color.bgBrightCyan(message)).to.be.eql(bgBrightCyan);
      expect(Color.bgBrightWhite(message)).to.be.eql(bgBrightWhite);
    });

    it('should print a console texts with all available foreground colors', () => {
      const black = parseFormat([30, 39], message);
      const red = parseFormat([31, 39], message);
      const green = parseFormat([32, 39], message);
      const yellow = parseFormat([33, 39], message);
      const blue = parseFormat([34, 39], message);
      const magenta = parseFormat([35, 39], message);
      const cyan = parseFormat([36, 39], message);
      const white = parseFormat([37, 39], message);

      expect(Color.black(message)).to.be.eql(black);
      expect(Color.red(message)).to.be.eql(red);
      expect(Color.green(message)).to.be.eql(green);
      expect(Color.yellow(message)).to.be.eql(yellow);
      expect(Color.blue(message)).to.be.eql(blue);
      expect(Color.magenta(message)).to.be.eql(magenta);
      expect(Color.cyan(message)).to.be.eql(cyan);
      expect(Color.white(message)).to.be.eql(white);
    });
  });

  describe('extended colors', () => {
    it('should print a console texts with all available bright colors', () => {
      const brightBlack = parseFormat([90, 39], message);
      const brightRed = parseFormat([91, 39], message);
      const brightGreen = parseFormat([92, 39], message);
      const brightYellow = parseFormat([93, 39], message);
      const brightBlue = parseFormat([94, 39], message);
      const brightMagenta = parseFormat([95, 39], message);
      const brightCyan = parseFormat([96, 39], message);
      const brightWhite = parseFormat([97, 39], message);

      expect(Color.brightBlack(message)).to.be.eql(brightBlack);
      expect(Color.brightRed(message)).to.be.eql(brightRed);
      expect(Color.brightGreen(message)).to.be.eql(brightGreen);
      expect(Color.brightYellow(message)).to.be.eql(brightYellow);
      expect(Color.brightBlue(message)).to.be.eql(brightBlue);
      expect(Color.brightMagenta(message)).to.be.eql(brightMagenta);
      expect(Color.brightCyan(message)).to.be.eql(brightCyan);
      expect(Color.brightWhite(message)).to.be.eql(brightWhite);
    });
  });

  describe('Formats', () => {
    it('should reset all formats applied to the console', () => {
      const reset = parseFormat();

      expect(Color.reset()).to.be.eql(reset);
    });

    it('should print a hidden console text', () => {
      const bold = parseFormat([1, 22], message);
      const dim = parseFormat([2, 22], message);
      const italic = parseFormat([3, 23], message);
      const underline = parseFormat([4, 24], message);
      const blink = parseFormat([5, 25], message);
      const inverse = parseFormat([7, 27], message);
      const hidden = parseFormat([8, 28], message);
      const strike = parseFormat([9, 29], message);

      expect(Color.bolder(message)).to.be.eql(bold);
      expect(Color.dim(message)).to.be.eql(dim);
      expect(Color.italic(message)).to.be.eql(italic);
      expect(Color.underline(message)).to.be.eql(underline);
      expect(Color.blink(message)).to.be.eql(blink);
      expect(Color.inverse(message)).to.be.eql(inverse);
      expect(Color.hidden(message)).to.be.eql(hidden);
      expect(Color.strikeThrough(message)).to.be.eql(strike);
    });
  });

  describe('other formats', () => {
    it('should print a console text with combined formats', () => {
      const text = '\x1b[37mHello\x1b[39m \x1b[47mWorld!\x1b[49m from \x1b[33mCustomConsoleColors\x1b[39m';

      expect(
        `${Color.white('Hello')} ${Color.bgWhite('World!')} from ${Color.yellow(
          'CustomConsoleColors',
        )}`,
      ).to.be.eql(text);
    });

    it('should print a formatted console text with chain of responsibility', () => {
      const text = 'Hello World!';

      expect(`${Color.bgWhite(Color.black('Hello World!'))}`).to.contain(text);
    });
  });
});
