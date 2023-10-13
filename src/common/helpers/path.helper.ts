/**
 * Validates and normalized given path value is valid.
 *
 * @param path Object to be analyzed.
 *
 * @returns The path value normalized.
 */
export const validatePath = (path: string): string => (path.charAt(0) !== '/') ? '/' + path : path;
