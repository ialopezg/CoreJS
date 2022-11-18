import { RequestMethod } from '../enums';

/**
 * Metadata information for @RequestMapping decorator annotation.
 */
export interface RequestMappingMetadata {
  /**
   * Method or route path.
   */
  path?: string;
  /**
   * HTTP Request Method.
   */
  method?: RequestMethod;
}
