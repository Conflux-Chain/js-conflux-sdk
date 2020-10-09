const { Conflux, providerFactory } = require('../../src');

// ----------------------------------------------------------------------------
test('constructor({http})', () => {
  const conflux = new Conflux({ url: 'http://localhost:12537' });

  expect(conflux.provider.constructor.name).toEqual('HttpProvider');

  const providerClose = jest.spyOn(conflux.provider, 'close');
  conflux.close();
  expect(providerClose).toHaveBeenCalledTimes(1);
  providerClose.mockRestore();

  expect(conflux.provider.constructor.name).toEqual('HttpProvider');
});

test('constructor({ws})', () => {
  const conflux = new Conflux({ url: 'ws://localhost:12537' });

  expect(conflux.provider.constructor.name).toEqual('WebSocketProvider');

  const providerClose = jest.spyOn(conflux.provider, 'close');
  conflux.close();
  expect(providerClose).toHaveBeenCalledTimes(1);
  providerClose.mockRestore();

  expect(conflux.provider.constructor.name).toEqual('WebSocketProvider');
});

test('constructor(error)', () => {
  expect(() => new Conflux({ url: 'error' })).toThrow('Invalid provider options');
});

test('constructor({defaultGasPrice})', async () => {
  const conflux = new Conflux({
    defaultGasPrice: 100,
  });

  expect(conflux.defaultGasPrice).toEqual(100);

  await expect(conflux.provider.call()).rejects.toThrow('request not implement');
});

test('change provider', async () => {
  const conflux = new Conflux();

  expect(conflux.provider.constructor.name).toEqual('BaseProvider');
  await expect(conflux.provider.call()).rejects.toThrow('request not implement');

  conflux.provider = providerFactory({ url: 'http://localhost:12537', timeout: 30 * 1000 });
  expect(conflux.provider.constructor.name).toEqual('HttpProvider');
  expect(conflux.provider.url).toEqual('http://localhost:12537');
  expect(conflux.provider.timeout).toEqual(30 * 1000);
});
