const lodash = require('lodash');
const BaseProvider = require('./BaseProvider');
const HttpProvider = require('./HttpProvider');
const WebsocketProvider = require('./WebSocketProvider');

/**
 * @param options {object}
 * @param options.url {string}
 * @return {WebsocketProvider|HttpProvider|BaseProvider}
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
function providerFactory({ url, ...rest }) {
  if (!url) {
    return new BaseProvider(rest); // empty provider
  }

  if (lodash.startsWith(url, 'http')) {
    return new HttpProvider({ url, ...rest });
  }

  if (lodash.startsWith(url, 'ws')) {
    return new WebsocketProvider({ url, ...rest }); // FIXME: support ws in browser
  }

  throw new Error('Invalid provider options');
}

module.exports = providerFactory;
