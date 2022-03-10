import superagent from 'superagent';
import BaseProvider from './BaseProvider.js';

/**
 * Http protocol json rpc provider.
 */
export default class HttpProvider extends BaseProvider {
  async _doRequest(data) {
    const { body } = await superagent
      .post(this.url)
      .retry(this.retry)
      .set(this.headers)
      .send(data)
      .timeout(this.timeout);
    return body;
  }

  async _request(data) {
    const body = await this._doRequest(data);
    return body || {};
  }

  async _requestBatch(dataArray) {
    const body = await this._doRequest(dataArray);
    return body || [];
  }
}
