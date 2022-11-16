/**
 * Looks for a key, or dot-notation, value in given target object.
 *
 * @param key Key property name
 * @param target Target object
 *
 * @returns Key property value.
 */
export const getValueFor = (key: string, target: any): any => {
  if (!key.length) {
    return null;
  }

  return key.split('.').reduce((o: any, k: string) => (o || {})[k], target);
};
