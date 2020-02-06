import lodash from 'lodash';

export default function callable(object, func) {
  if (!lodash.isFunction(func)) {
    throw new Error('except to be function');
  }

  return new Proxy(func, {
    getPrototypeOf: () => Object.getPrototypeOf(object),
    getOwnPropertyDescriptor: (_, key) => Object.getOwnPropertyDescriptor(object, key),
    ownKeys: () => Reflect.ownKeys(object),
    has: (_, key) => Reflect.has(object, key),
    get: (_, key) => Reflect.get(object, key),
    set: (_, key, value) => Reflect.set(object, key, value),
    deleteProperty: (_, key) => Reflect.deleteProperty(object, key),
  });
}

export function withoutNew(Class) {
  return new Proxy(Class, { apply: (_, __, params) => new Class(...params) });
}
