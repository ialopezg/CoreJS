import { RequestMethod } from '../../common';
import { IRouterMatcher, Router } from 'express';

export class RouterMethodFactory {
  /**
   * Gets the appropriated request method to given HTTP Request Method.
   * @param {Router} target Target router.
   * @param {RequestMethod} method HTTP Request Method.
   */
  public get(target: Router, method: RequestMethod): IRouterMatcher<Router> {
    switch (method) {
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
