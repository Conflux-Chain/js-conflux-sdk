const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  /**
   * @param url {string} - Full json rpc http url
   * @param [options] {object} - See [BaseProvider.constructor](#provider/BaseProvider.js/constructor)
   * @return {HttpProvider}
   *
   * @example
   * > const provider = new HttpProvider('http://testnet-jsonrpc.conflux-chain.org:12537', {logger: console});
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(url, options) {
    super(url, options);
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

    const { body: { result, error } = {} } = await superagent
      .post(this.url)
      .send(data)
      .timeout(this.timeout);

    if (error) {
      this.logger.error({ data, error, duration: Date.now() - startTime });
      throw new BaseProvider.RPCError(error);
    } else {
      this.logger.info({ data, result, duration: Date.now() - startTime });
    }

    return result;
  }
}

module.exports = HttpProvider;
