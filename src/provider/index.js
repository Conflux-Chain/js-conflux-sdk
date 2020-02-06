import { BaseProvider } from './BaseProvider';
import HttpProvider from './HttpProvider';
// import WebsocketProvider from './WebsocketProvider';

export default function providerFactory(url, options) {
  let provider;

  if (typeof url !== 'string') {
    throw new Error(`url must be string, got ${url}`);
  }

  if (!url) {
    provider = new BaseProvider(url, options); // empty provider
  } else if (url.startsWith('http')) {
    provider = new HttpProvider(url, options);
  } else if (url.startsWith('ws')) {
    throw new Error(`Invalid protocol or url "${url}"`); // FIXME: support ws in browser
    // provider = new WebsocketProvider(url, options);
  } else {
    throw new Error(`Invalid protocol or url "${url}"`);
  }

  return provider;
}
