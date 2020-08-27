class LazyPromise {
  constructor(func, params) {
    this._func = func;
    this._params = params;
    this._promise = undefined; // not call `func(...params)` immediately
  }

  async then(resolve, reject) {
    this._promise = this._promise || this._func(...this._params);

    try {
      return resolve(await this._promise);
    } catch (e) {
      return reject(e);
    }
  }

  async catch(callback) {
    return this.then(v => v, callback);
  }

  async finally(callback) {
    try {
      return await this;
    } finally {
      await callback();
    }
  }
}

module.exports = LazyPromise;
