import { Transport } from '../../common';

/**
 * Represents a Microservice Configuration.
 */
export interface MicroserviceConfiguration {
  /**
   * Transportation type
   */
  transport?: Transport;
  /**
   * Service URL.
   */
  url?: string;
  /**
   * Port number.
   */
  port?: number;
  /**
   * Hostname
   */
  host?: string;
}
