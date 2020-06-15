const lodash = require('lodash');

function callable(object, func) {
  if (!lodash.isFunction(func)) {
    throw new Error('except to be function');
  }

  return new Proxy(func, {
    getPrototypeOf: () => Object.getPrototypeOf(object),
    // setPrototypeOf
    // isExtensible
    // preventExtensions
    getOwnPropertyDescriptor: (_, key) => Object.getOwnPropertyDescriptor(object, key),
    has: (_, key) => Reflect.has(object, key),
    get: (_, key) => Reflect.get(object, key),
    set: (_, key, value) => Reflect.set(object, key, value),
    deleteProperty: (_, key) => Reflect.deleteProperty(object, key),
    // defineProperty
    enumerate: () => Reflect.enumerate(object),
    ownKeys: () => Reflect.ownKeys(object),
    // apply
    // construct
  });
}

function withoutNew(Class) {
  return new Proxy(Class, { apply: (_, __, params) => new Class(...params) });
}

module.exports = callable;
module.exports.withoutNew = withoutNew;
