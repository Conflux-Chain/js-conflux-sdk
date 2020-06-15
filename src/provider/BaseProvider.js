class RPCError extends Error {
  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

class BaseProvider {
  /**
   * @param url {string} - Full json rpc http url
   * @param [options] {object}
   * @param [options.timeout=60*1000] {number} - Request time out in ms
   * @param [options.logger] {object} - Logger with `info` and `error`
   * @return {BaseProvider}
   */
  constructor(url, {
    timeout = 5 * 60 * 1000,
    logger = { info: () => undefined, error: () => undefined },
  } = {}) {
    this.url = url;
    this.timeout = timeout;
    this.logger = logger;
  }

  /**
   * Gen a random json rpc id.
   * It is used in `call` method, overwrite it to gen your own id.
   *
   * @return {string}
   */
  requestId() {
    return `${Date.now()}${Math.random().toFixed(7).substring(2)}`; // 13+7=20 int string
  }

  async call() {
    throw new Error(`NotImplementError: ${this.constructor.name}.call not implement.`);
  }

  close() {}
}

module.exports = BaseProvider;
module.exports.RPCError = RPCError;
