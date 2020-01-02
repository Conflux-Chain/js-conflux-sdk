function namedTuple(...names) {
  const _nameToIndex = {};
  names.forEach((name, index) => {
    _nameToIndex[name] = index;
  });

  class NamedTuple extends Array {
    constructor(...args) {
      super(...args);

      return new Proxy(this, {
        has: (_, key) => {
          const index = _nameToIndex[key];
          return index !== undefined ? true : (key in this);
        },
        get: (_, key) => {
          const index = _nameToIndex[key];
          return index === undefined ? this[key] : this[index];
        },
        set: () => {
          throw new Error('can not change element to a NamedTuple');
        },
        deleteProperty: () => {
          throw new Error('can not delete element to a NamedTuple');
        },
      });
    }

    static get name() {
      return `NamedTuple(${this.names.join(',')})`;
    }

    static get names() {
      return names;
    }

    static fromObject(object) {
      return new this(...names.map(name => object[name]));
    }

    toObject() {
      const obj = {};
      names.forEach(name => {
        obj[name] = this[name];
      });
      return obj;
    }
  }

  return NamedTuple;
}

module.exports = namedTuple;
