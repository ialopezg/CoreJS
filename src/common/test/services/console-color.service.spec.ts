import { expect } from 'chai';
import { ColorService as Color } from '../../services';
import * as utils from '../../helpers';

describe('Color', () => {
  let message: string;

  beforeEach(() => {
    message = 'Hello World!';
  });

  describe('Colors', () => {
    it('should print console texts with all available background colors', () => {
      const bgBlack = `\x1b[40m${message}\x1b[49m`;
      const bgMagenta = `\x1b[45m${message}\x1b[49m`;
      const bgCyan = `\x1b[46m${message}\x1b[49m`;
      const bgWhite = `\x1b[47m${message}\x1b[49m`;

      expect(Color.bgBlack(message)).to.be.eql(bgBlack);
      expect(Color.bgMagenta(message)).to.be.eql(bgMagenta);
      expect(Color.bgCyan(message)).to.be.eql(bgCyan);
      expect(Color.bgWhite(message)).to.be.eql(bgWhite);
    });

    it('should print console texts with all available bright background colors', () => {
      const bgBrightMagenta = utils.parseFormat([105, 49], message);
      const bgBrightCyan = utils.parseFormat([106, 49], message);
      const bgBrightWhite = utils.parseFormat([107, 49], message);

      expect(Color.bgBrightMagenta(message)).to.be.eql(bgBrightMagenta);
      expect(Color.bgBrightCyan(message)).to.be.eql(bgBrightCyan);
      expect(Color.bgBrightWhite(message)).to.be.eql(bgBrightWhite);
    });

    it('should print a console texts with all available foreground colors', () => {
      const magenta = utils.parseFormat([35, 39], message);
      const cyan = utils.parseFormat([36, 39], message);
      const white = utils.parseFormat([37, 39], message);

      expect(Color.magenta(message)).to.be.eql(magenta);
      expect(Color.cyan(message)).to.be.eql(cyan);
      expect(Color.white(message)).to.be.eql(white);
    });

    it('should print a console texts with all available bright colors', () => {
      const brightMagenta = utils.parseFormat([95, 39], message);
      const brightCyan = utils.parseFormat([96, 39], message);
      const brightWhite = utils.parseFormat([97, 39], message);

      expect(Color.brightMagenta(message)).to.be.eql(brightMagenta);
      expect(Color.brightCyan(message)).to.be.eql(brightCyan);
      expect(Color.brightWhite(message)).to.be.eql(brightWhite);
    });
  });

  describe('Formats', () => {
    it('should reset all formats applied to the console', () => {
      const reset = utils.parseFormat();

      expect(Color.reset()).to.be.eql(reset);
    });

    it('should print a hidden console text', () => {
      const inverse = utils.parseFormat([7, 27], message);
      const hidden = utils.parseFormat([8, 28], message);
      const strike = utils.parseFormat([9, 29], message);

      expect(Color.inverse(message)).to.be.eql(inverse);
      expect(Color.hidden(message)).to.be.eql(hidden);
      expect(Color.strikeThrough(message)).to.be.eql(strike);
    });
  });

  describe('Other formats', () => {
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

      expect(`${Color.bgWhite().black('Hello World!')}`).contain(text);
    });
  });
});
