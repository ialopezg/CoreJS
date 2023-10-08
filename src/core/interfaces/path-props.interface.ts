import { RequestMethod } from '../enums';

/**
 * Path property definitions.
 */
export interface PathProps {
  /**
   * Base path
   */
  path: string;
  /**
   * Request method.
   */
  method?: RequestMethod;
}
