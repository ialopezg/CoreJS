import * as utils from "../../utils";

describe('parseFormat', () => {
  const message = 'Hello World!';

  it('should "parseFormat" function called properly', () => {
    const resetValue = utils.parseFormat();
    const value = utils.parseFormat([1, 22], message);

    expect(value).toContain(message);
    expect(resetValue).toBe(`\x1b[0m\x1b[0m`);
  });
});
