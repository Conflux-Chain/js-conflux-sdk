const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');
const { isWeappEnv } = require('../util');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  async request(data) {
    if (isWeappEnv()) {
      return new Promise(function (resolve, reject) {
        let retryCount = this.retry;
        const sendRequest = () => {
          wx.request({
            method: 'POST',
            url: this.url,
            header: this.headers,
            data,
            timeout: this.timeout,
            success: res => {
              resolve(res.data);
            },
            fail: () => {
              if (retryCount > 0) {
                retryCount -= 1;
                sendRequest();
              } else {
                reject(new Error('SendWeappRequestError'));
              }
            },
          });
        };
        sendRequest();
      });
    } else {
      const { body } = await superagent
        .post(this.url)
        .retry(this.retry)
        .set(this.headers)
        .send(data)
        .timeout(this.timeout);

      return body || {};
    }
  }

  async requestBatch(dataArray) {
    if (isWeappEnv()) {
      return new Promise(function (resolve, reject) {
        let retryCount = this.retry;
        const sendRequest = () => {
          wx.request({
            method: 'POST',
            url: this.url,
            header: this.headers,
            dataArray,
            timeout: this.timeout,
            success: res => {
              resolve(res.data);
            },
            fail: () => {
              if (retryCount > 0) {
                retryCount -= 1;
                sendRequest();
              } else {
                reject(new Error('SendWeappRequestError'));
              }
            },
          });
        };
        sendRequest();
      });
    } else {
      const { body } = await superagent
        .post(this.url)
        .retry(this.retry)
        .set(this.headers)
        .send(dataArray)
        .timeout(this.timeout);
      return body || [];
    }
  }
}

module.exports = HttpProvider;
