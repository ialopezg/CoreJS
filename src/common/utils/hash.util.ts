import { isUndefined } from './validator.util';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * Hash a text with given parameters.
 *
 * @param text Text to be hashed.
 * @param salt Salts or rounds.
 *
 * @returns Hashed text.
 */
export const generateHash = async (
  text: string,
  salt?: number,
): Promise<string> => {
  const rounds = isUndefined(salt) ? 10 : salt;

  return bcrypt.hash(text, rounds);
};

/**
 * Compares a plain text with a hashed text.
 *
 * @param password Text to be validated.
 * @param hash Hashed text to be compared.
 *
 * @returns True if text match, otherwise false.
 */
export const validateHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash || '');
};

/**
 * Encodes a text for non human readable.
 *
 * @param text Text to be encoded.
 *
 * @returns Text encoded.
 */
export const encodeString = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
};
