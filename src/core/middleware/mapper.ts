import { RequestMethod, PATH_METADATA, isUndefined, validatePath } from '../../common';
import { RequestMappingMetadata } from '../../common/interfaces';
import { UnknownRequestMappingException } from '../../errors/exceptions';
import { RouterBuilder } from '../router';

/**
 * Defines an object that map routes.
 */
export class RoutesMapper {
  private readonly builder = new RouterBuilder();

  /**
   * Maps a Controller instance to middleware properties.
   *
   * @param route Controller instance to be mapped.
   *
   * @returns A collection containing route properties.
   */
  mapControllerToControllerMetadata(route: any) {
    const routePath: string = Reflect.getMetadata(PATH_METADATA, route);
    if (isUndefined(routePath)) {
      return [this.mapObjectToRouteProps(route)];
    }

    const paths = this.builder.scanPathsFromPrototype(Object.create(route), route.prototype);

    return paths.map((singlePath) => ({
      path: this.validateRoutePath(routePath) + this.validateRoutePath(singlePath.path),
      method: singlePath.method,
    }));
  }

  /**
   * Map an object to RequestMappingMetadata properties.
   *
   * @param route Controller instance to be mapped.
   *
   * @returns An object containing the path and method requested.
   */
  private mapObjectToRouteProps(route: RequestMappingMetadata) {
    const {
      path,
      method,
    } = route;

    if (isUndefined(path)) {
      throw new UnknownRequestMappingException();
    }

    return {
      path: this.validateRoutePath(path),
      method: (isUndefined(method)) ? RequestMethod.ALL : method,
    };
  }

  /**
   * Validate a path if properly setup.
   *
   * @param path Path to be validated.
   *
   * @returns THe path properly validated.
   */
  private validateRoutePath(path: string): string {
    return validatePath(path);
  }
}
