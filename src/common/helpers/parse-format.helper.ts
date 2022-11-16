/**
 * Parses a message with ANSI code color or format.
 *
 * @param code Array containing start and end color codes.
 * @param message Message to be parsed.
 */
export const parseFormat = (code?: number[], message?: string): string => {
  code = code || [0, 0];
  message = message || '';

  return `\x1b[${code[0]}m${message}\x1b[${code[1]}m`;
};
