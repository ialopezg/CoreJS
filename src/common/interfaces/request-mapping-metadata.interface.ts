import { RequestMethod } from '../enums';

/**
 * Route definitions.
 */
export interface RequestMappingMetadata {
  /**
   * Path.
   */
  path?: string;
  /**
   * Request method.
   */
  method?: RequestMethod;
}
