import { RequestMethod } from '../../common';
import { Controller } from '../../common/interfaces';
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
   * @param controller Controller instance to be mapped.
   *
   * @returns A collection caontaining route properties.
   */
  mapControllerToControllerMetadata(controller: Controller | any) {
    const controllerPath = Reflect.getMetadata('path', controller);

    if (typeof controllerPath === 'undefined') {
      return [this.mapObjectToControllerProps(controller)];
    }

    const paths = this.builder.scanPathsFromPrototype(
      Object.create(controller),
      controller.prototype,
    );

    return paths.map((route: any) => ({
      path: `${this.validateRoutePath(controllerPath)}${this.validateRoutePath(route.path)}`,
      method: route.method,
    }));
  }

  /**
   * Map an object to ControllerMetadata properties.
   *
   * @param controller Controller instance to be mapped.
   *
   * @returns An object containing the path and method requested.
   */
  private mapObjectToControllerProps(controller: any) {
    if (typeof controller.path === 'undefined') {
      throw new UnknownRequestMappingException();
    }

    return {
      path: this.validateRoutePath(controller.path),
      method: (typeof controller.method === 'undefined') ? RequestMethod.ALL : controller.method,
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
    return (path.charAt(0) !== '/') ? '/' + path : path;
  }
}
