const { RpcTransport } = require('ox');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  constructor(options) {
    super(options);

    this.transport = RpcTransport.fromHttp(this.url, {
      timeout: this.timeout,
      fetchOptions: {
        headers: this.headers,
        keepalive: this.keepAlive,
      },
    });
  }

  async _request(data) {
    try {
      const result = await this.transport.request(data);
      return { result };
    } catch (err) {
      const error = {
        code: err.code,
        message: err.message,
        data: err.data,
      };
      return { error };
    }
  }

  async _requestBatch(dataArray) {
    const response = await fetch(this.url, { // eslint-disable-line
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataArray),
    });
    return response.json();
  }
}

module.exports = HttpProvider;
