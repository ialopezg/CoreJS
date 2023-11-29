/**
 * Represents a meta-type object.
 */
export interface MetaType<T> {
  /**
   * Creates a new instance of the meta-type given.
   *
   * @param {any[]} args Object to be injected.
   */
  new(...args: any[]): T
}
