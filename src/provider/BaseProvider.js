const EventEmitter = require('events');
const RPCError = require('./RPCError');

class BaseProvider extends EventEmitter {
  /**
   * @param [options] {object}
   * @param options.url {string} - Full json rpc http url
   * @param [options.timeout=60*1000] {number} - Request time out in ms
   * @param [options.logger] {object} - Logger with `info` and `error`
   * @return {BaseProvider}
   */
  constructor({
    url,
    timeout = 5 * 60 * 1000,
    logger = { info: () => undefined, error: () => undefined },
  }) {
    super();
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
    return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
  }

  request() {
    throw new Error(`NotImplementError: ${this.constructor.name}.request not implement.`);
  }

  requestBatch() {
    throw new Error(`NotImplementError: ${this.constructor.name}.requestBatch not implement.`);
  }

  /**
   * Call a json rpc method with params
   *
   * @param method {string} - Json rpc method name.
   * @param [params] {array} - Json rpc method params.
   * @return {Promise<*>} Json rpc method return value.
   *
   * @example
   * > await provider.call('cfx_epochNumber');
   * > await provider.call('cfx_getBlockByHash', blockHash);
   */
  async call(method, ...params) {
    const startTime = Date.now();
    const data = { jsonrpc: '2.0', id: this.requestId(), method, params };

    const { result, error } = await this.request(data);

    if (error) {
      this.logger.error({ data, error, duration: Date.now() - startTime });
      throw new RPCError(error, { method, params });
    } else {
      this.logger.info({ data, result, duration: Date.now() - startTime });
    }

    return result;
  }

  /**
   * Batch call json rpc methods with params
   *
   * @param array {object[]} - Array of object with "method" and "params"
   * @return {Promise<Array>}
   *
   * @example
   * > await provider.batch([
   *   { method: 'cfx_epochNumber' },
   *   { method: 'cfx_getBalance', params: ['cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp'] },
   *   { method: 'InValidInput' },
   * ])
   [ '0x3b734d', '0x22374d959c622f74728', RPCError: Method not found ]
   */
  async batch(array) {
    if (!array.length) {
      return [];
    }

    const startTime = Date.now();
    const dataArray = array.map(data => ({ jsonrpc: '2.0', id: this.requestId(), ...data }));

    const returnArray = await this.requestBatch(dataArray);

    this.logger.info({ dataArray, returnArray, duration: Date.now() - startTime });
    return returnArray.map(({ result, error }, i) => (error ? new RPCError(error, array[i]) : result));
  }

  close() {}
}

module.exports = BaseProvider;
module.exports.RPCError = RPCError;
