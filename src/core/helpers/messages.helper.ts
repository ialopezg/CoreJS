import { RequestMethod } from '../../common';

/**
 * On init module message.
 *
 * @param module Module name.
 * @returns The message requested.
 */
export const getModuleInitMessage = (module: string) => `${module} dependencies initialized`;
/**
 * Get route mapping message.
 *
 * @param path Controller route path.
 * @param method Controller method path.
 * @returns The message requested.
 */
export const getRouteMappedMessage =
  (path: string, method: RequestMethod) => `Mapped {${path}, ${RequestMethod[method]}} route`;
/**
 * Get controller mapping message.
 * @param name Controller name.
 * @returns The message requested.
 */
export const getControllerMappingMessage = (name: string) => `${name}:`;
/**
 * Get middleware init message.
 *
 * @param middleware Middleware name,
 * @param module Module name
 * @returns The message requested.
 */
export const getMiddlewareInitMessage = (middleware: string, module: string) => `${middleware} injected into ${module}`;
