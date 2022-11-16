import * as crypto from 'crypto';

/**
 * Capitalize first char of a word.
 *
 * If word is capitalized this will be lowercased then the first char will be capitalized.
 *
 * @param text text to be transformed.
 *
 * @returns Text with first char capitalized.
 */
export const capitalizeFirst = (text: string) => {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
};

/**
 * Generates a random string with given size length.
 *
 * @param length String length.
 *
 * @returns A random string.
 */
export const randomString = (length: number): string => {
  return crypto.randomBytes(64).toString('hex');
};
