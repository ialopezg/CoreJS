export const getInvalidMiddlewareMessage = (target: string) =>
  `Middleware ${target} has been setup without "resolve()" method!`;

export const getInvalidModuleConfigMessage = (property: string) =>
  `Invalid property '${property}' in @Module() decorator!`;

export const getUnknownDependenciesMessage = (target: string) =>
  `Can't recognize dependencies of ${target}!`;

export const getUnknownExportMessage = (name: string) =>
  `Unknown ${name} component. Remember - to export a component should be listed components array!`;

export const INVALID_MIDDLEWARE_CONFIGURATION =
  `Invalid middleware configuration passed in module 'configure()' method!`;

export const UNKNOWN_REQUEST_MAPPING =
  `Request mapping properties not defined in @RequestMapping() annotation!`;
