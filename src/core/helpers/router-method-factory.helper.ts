import { Router } from 'express';

import { RequestMethod } from '../../common';

/**
 * Defines an object that create generic router methods.
 */
export class RouterMethodFactory {
  /**
   * Get the router method for given HTTP Request method.
   *
   * @param target Express Router instance.
   * @param requestMethod
   *
   * @returns The router method for given HTTP Request method.
   */
  get(target: Router, requestMethod: RequestMethod) {
    switch (requestMethod) {
      case RequestMethod.POST:
        return target.post;
      case RequestMethod.ALL:
        return target.all;
      case RequestMethod.DELETE:
        return target.delete;
      case RequestMethod.PUT:
        return target.put;
      default:
        return target.get;
    }
  }
}
