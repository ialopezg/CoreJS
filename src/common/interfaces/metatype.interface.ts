/**
 * Defines a prototype that implement common properties and methods.
 */
export interface MetaType<T> {
  /**
   * Prototype constructor.
   */
  new(...args: any[]): T;
}
