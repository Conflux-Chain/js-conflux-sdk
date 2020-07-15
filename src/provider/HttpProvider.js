const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
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
