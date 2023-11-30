import { IMiddleware } from '../../core';
import { Constructor } from './merge-with-values.decorator';

/**
 * Bind values to the resolve method of annotated object.
 *
 * @param {any[]} data Data to be injected.
 *
 * @constructor
 */
export const BindResolveValues = <T extends Constructor<IMiddleware>>(
  data: Array<any>,
) => {
  return (metaType: T): any => {
    const type = class extends metaType {
      resolve() {
        return super.resolve(...data);
      }
    };
    const token = metaType.name + JSON.stringify(data);
    Object.defineProperty(type, 'name', { value: token });

    return type;
  };
};
