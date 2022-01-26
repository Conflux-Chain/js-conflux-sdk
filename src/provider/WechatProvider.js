const BaseProvider = require('./BaseProvider');

/**
 * Wechat provider
 */
class WechatProvider extends BaseProvider {
  async _doRequest(data) {
    return new Promise((resolve, reject) => {
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
              reject(new Error('SendWechatRequestError'));
            }
          },
        });
      };
      //
      sendRequest();
    });
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

module.exports = WechatProvider;
