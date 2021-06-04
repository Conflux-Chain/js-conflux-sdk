const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  async request(data) {
    const { body } = await superagent
      .post(this.url)
      .retry(this.retry)
      .send(data)
      .timeout(this.timeout);

    return body || {};
  }

  async requestBatch(dataArray) {
    const { body } = await superagent
      .post(this.url)
      .retry(this.retry)
      .send(dataArray)
      .timeout(this.timeout);
    return body || [];
  }
}

module.exports = HttpProvider;
