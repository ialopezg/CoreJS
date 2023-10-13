import { RequestMethod } from '../../common';

export const getInitializedModuleMessage = (module: string) => `${module} dependencies initialized`;
export const getRouteMappedMessage = (path: string, method: RequestMethod) => `Mapped {${path}, ${RequestMethod[method]}} route`;
export const getControllerMappingMessage = (name: string) => `${name}:`;
export const getMiddlewareInitMessage = (middleware: string, module: string) => `${middleware} injected into ${module}`;
