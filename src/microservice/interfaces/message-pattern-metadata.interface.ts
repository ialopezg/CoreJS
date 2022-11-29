/**
 * Defines a prototype with MetaType information for @MessagePattern annotations.
 */
export interface MessagePatternMetadata {
  /**
   * Any property name with any value kind.
   */
  [prop: string]: any;
}
