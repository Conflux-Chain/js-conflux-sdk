function namedTuple(...names) {
  const _nameToIndex = {};
  names.forEach((name, index) => {
    _nameToIndex[name] = index;
  });

  class NamedTuple extends Array {
    constructor(...args) {
      super(...args);
      return new Proxy(this, this.constructor);
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

    static has(self, name) {
      const index = _nameToIndex[name];
      return index === undefined ? (name in self) : true;
    }

    static get(self, name) {
      const index = _nameToIndex[name];
      return index === undefined ? self[name] : self[index];
    }

    static set() {
      throw new Error('can not change element to a NamedTuple');
    }

    static deleteProperty() {
      throw new Error('can not delete element to a NamedTuple');
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
