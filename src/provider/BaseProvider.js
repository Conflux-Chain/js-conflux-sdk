/* eslint-disable no-unused-vars */
const EventEmitter = require('events');
const RPCError = require('./RPCError');

class BaseProvider extends EventEmitter {
  /**

   * @param {object} [options]
   * @param {string} options.url - Full json rpc http url
   * @param {number} [options.timeout=30*1000] - Request time out in ms
   * @param {number} [options.retry=1] - Retry number
   * @param {boolean} [options.keepAlive=false] - Whether open the http keep-alive option
   * @param {object} [options.logger] - Logger with `info` and `error`
   * @return {BaseProvider}
   */
  constructor({
    url,
    retry = 1,
    timeout = 30 * 1000,
    keepAlive = false,
    logger = { info: () => undefined, error: () => undefined },
  }) {
    super();
    this.url = url;
    this.retry = retry;
    this.timeout = timeout;
    this.logger = logger;
    this.keepAlive = keepAlive;
    const headers = {};
    if (keepAlive) {
      headers.Connection = 'Keep-Alive';
    }
    this.headers = headers;
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

  /**
   * @param {any}
   * @private
   * @return {Promise<*>}
   */
  _request(_any) {
    throw new Error(`NotImplementError: ${this.constructor.name}.request not implement.`);
  }

  /**
   * @param {any[]}
   * @return {Promise<*>}
   * @private
   */
  _requestBatch(_any) {
    throw new Error(`NotImplementError: ${this.constructor.name}.requestBatch not implement.`);
  }

  /**
   * Call a json rpc method with params
   *
   * @param {object} data
   * @param {string} data.method - Json rpc method name.
   * @param {array} [data.params] - Json rpc method params.
   * @return {Promise<*>} Json rpc method return value.
   *
   * @example
   * > await provider.request({method: 'cfx_epochNumber'});
   * > await provider.request({method: 'cfx_getBlockByHash', params: [blockHash]});
   */
  async request({ method, params = [] }) {
    const startTime = Date.now();
    const data = { jsonrpc: '2.0', id: this.requestId(), method, params };

    const { result, error } = await this._request(data);

    if (error) {
      this.logger.error({ data, error, duration: Date.now() - startTime });
      throw new RPCError(error, { method, params });
    } else {
      this.logger.info({ data, result, duration: Date.now() - startTime });
    }

    return result;
  }

  /**
   * Call a json rpc method with params
   *
   * @param {string} method - Json rpc method name.
   * @param {any[]} params - Json rpc method params.
   * @return {Promise<*>} Json rpc method return value.
   *
   * @example
   * > await provider.call('cfx_epochNumber');
   * > await provider.call('cfx_getBlockByHash', blockHash);
   */
  async call(method, ...params) {
    return this.request({ method, params });
  }

  /**
   * Send a json rpc method request
   *
   * @param {string} method - Json rpc method name.
   * @param {array} [params] - Json rpc method params.
   * @return {Promise<*>} Json rpc method return value.
   *
   * @example
   * > await provider.send('cfx_epochNumber');
   * > await provider.send('cfx_getBlockByHash', [blockHash]);
   */
  async send(method, params) {
    return this.request({ method, params });
  }

  /**
   * Batch call json rpc methods with params
   *
   * @param {object[]} array - Array of object with "method" and "params"
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

    const returnArray = await this._requestBatch(dataArray);

    this.logger.info({ dataArray, returnArray, duration: Date.now() - startTime });
    return returnArray.map(({ result, error }, i) => (error ? new RPCError(error, array[i]) : result));
  }

  close() {}
}

module.exports = BaseProvider;
module.exports.RPCError = RPCError;
