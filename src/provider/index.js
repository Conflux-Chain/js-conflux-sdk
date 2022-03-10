import { startsWith } from 'lodash-es';
import BaseProvider from './BaseProvider.js';
import HttpProvider from './HttpProvider.js';
import WebsocketProvider from './WebSocketProvider.js';
import WechatProvider from './WechatProvider.js';

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
export default function providerFactory({ url, useWechatProvider, ...rest }) {
  if (!url) {
    return new BaseProvider(rest); // empty provider
  }

  if (startsWith(url, 'http')) {
    return useWechatProvider ? new WechatProvider({ url, ...rest }) : new HttpProvider({ url, ...rest });
  }

  if (startsWith(url, 'ws')) {
    return new WebsocketProvider({ url, ...rest }); // FIXME: support ws in browser
  }

  throw new Error('Invalid provider options');
}
