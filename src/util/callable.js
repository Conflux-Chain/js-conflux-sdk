import { isFunction } from 'lodash-es';

export default function callable(object, func) {
  if (!isFunction(func)) {
    throw new Error('except to be function');
  }

  return new Proxy(func, {
    getPrototypeOf: () => Object.getPrototypeOf(object),
    // setPrototypeOf
    // isExtensible
    // preventExtensions
    getOwnPropertyDescriptor: (_, key) => Object.getOwnPropertyDescriptor(object, key),
    has: (_, key) => (Reflect.has(object, key) || Reflect.has(func, key)),
    get: (_, key) => (Reflect.has(object, key) ? Reflect.get(object, key) : Reflect.get(func, key)),
    set: (_, key, value) => Reflect.set(object, key, value),
    deleteProperty: (_, key) => Reflect.deleteProperty(object, key),
    defineProperty: (_, key, attributes) => Reflect.defineProperty(object, key, attributes),
    ownKeys: () => Reflect.ownKeys(object),
    // apply
    // construct
  });
}
