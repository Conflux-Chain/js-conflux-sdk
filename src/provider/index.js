const BaseProvider = require('./BaseProvider');
const HttpProvider = require('./HttpProvider');
const WebsocketProvider = require('./WebsocketProvider');

function providerFactory(url, options) {
  let provider;

  if (typeof url !== 'string') {
    throw new Error(`url must be string, got ${url}`);
  }

  if (!url) {
    provider = new BaseProvider(url, options); // empty provider
  } else if (url.startsWith('http')) {
    provider = new HttpProvider(url, options);
  } else if (url.startsWith('ws')) {
    provider = new WebsocketProvider(url, options);
  } else {
    throw new Error(`Invalid protocol or url "${url}"`);
  }

  return provider;
}

module.exports = providerFactory;
