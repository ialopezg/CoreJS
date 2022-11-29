import { Transport } from '../../common';

/**
 * Microservice configuration properties.
 */
export interface MicroserviceConfiguration {
  /**
   * Microservice transport type.
   */
  transport?: Transport;
  /**
   * Microservice URL.
   */
  url?: string;
  /**
   * Microservice port.
   */
  port?: number;
  /**
   * Microservice hostname.
   */
  host?: string
}
