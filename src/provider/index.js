const lodash = require('lodash');
const BaseProvider = require('./BaseProvider');
const HttpProvider = require('./HttpProvider');
const WechatProvider = require('./WechatProvider');
const WebsocketProvider = require('./WebSocketProvider');

/**
 * @param {object} options
 * @param {string} options.url
 * @param {boolean} [options.useWechatProvider] - Whether use wechat provider.
 * @return {WebsocketProvider|HttpProvider|BaseProvider|WechatProvider}
 *
 * @example
 * > providerFactory()
 BaseProvider {
    url: undefined,
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
 * @example
 * > providerFactory({ url: 'http://localhost:12537' })
 HttpProvider {
    url: 'http://localhost:12537',
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }

 * > providerFactory({
    url: 'http://main.confluxrpc.org',
    timeout: 60 * 60 * 1000,
    logger: console,
  }
 HttpProvider {
    url: 'http://main.confluxrpc.org',
    timeout: 3600000,
    logger: {...}
  }
 */
function providerFactory({ url, useWechatProvider, ...rest }) {
  if (!url) {
    return new BaseProvider(rest); // empty provider
  }

  if (lodash.startsWith(url, 'http')) {
    return useWechatProvider ? new WechatProvider({ url, ...rest }) : new HttpProvider({ url, ...rest });
  }

  if (lodash.startsWith(url, 'ws')) {
    return new WebsocketProvider({ url, ...rest }); // FIXME: support ws in browser
  }

  throw new Error('Invalid provider options');
}

module.exports = providerFactory;
