interface Constructor<T> {
  new (...args: any[]): T;
}

/**
 * Inject values to the annotated object.
 *
 * @param {any[]} data Data to be injected.
 *
 * @constructor
 */
export const ProvideValues = <T extends Constructor<{}>>(data: any) => {
  return (metaType: T) => {
    const type = class extends metaType {
      constructor(...args: any[]) {
        super(args);
      }
    };
    const token = metaType.name + JSON.stringify(data);
    Object.defineProperty(type, 'name', { value: token });
    Object.assign(type.prototype, data);

    return type;
  };
}
