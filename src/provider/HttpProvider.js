const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  async request(data) {
    const { body } = await superagent
      .post(this.url)
      .send(data)
      .timeout(this.timeout);

    return body || {};
  }

  async requestBatch(dataArray) {
    const { body } = await superagent
      .post(this.url)
      .send(dataArray)
      .timeout(this.timeout);
    return body || [];
  }
}

module.exports = HttpProvider;
