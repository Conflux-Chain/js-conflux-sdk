const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  async _request(data) {
    const { body } = await superagent
      .post(this.url)
      .retry(this.retry)
      .set(this.headers)
      .send(data)
      .timeout(this.timeout);

    return body || {};
  }

  async _requestBatch(dataArray) {
    const { body } = await superagent
      .post(this.url)
      .retry(this.retry)
      .set(this.headers)
      .send(dataArray)
      .timeout(this.timeout);
    return body || [];
  }
}

module.exports = HttpProvider;
