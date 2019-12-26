class LazyPromise {
  constructor(func, params) {
    this._func = func;
    this._params = params;
    this._promise = undefined; // not call `func(...params)` immediately
  }

  async then(resolve, reject) {
    this._promise = this._promise || this._func(...this._params);

    try {
      resolve(await this._promise);
    } catch (e) {
      reject(e);
    }
  }
}

module.exports = LazyPromise;
