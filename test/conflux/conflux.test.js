const { Conflux, providerFactory } = require('../../src');

// ----------------------------------------------------------------------------
test('constructor({...})', () => {
  const conflux = new Conflux({
    url: 'http://localhost:12537',
    logger: console,
  });

  expect(conflux.provider.constructor.name).toEqual('HttpProvider');

  const providerClose = jest.spyOn(conflux.provider, 'close');
  conflux.close();
  expect(providerClose).toHaveBeenCalledTimes(1);
  providerClose.mockRestore();

  expect(conflux.provider.constructor.name).toEqual('BaseProvider');
});

test('constructor({defaultGasPrice})', async () => {
  const conflux = new Conflux({
    defaultGasPrice: 100,
  });

  expect(conflux.defaultGasPrice).toEqual(100);

  await expect(conflux.provider.call()).rejects.toThrow('call not implement');
});

test('change provider', async () => {
  const conflux = new Conflux();

  expect(conflux.provider.constructor.name).toEqual('BaseProvider');
  await expect(conflux.provider.call()).rejects.toThrow('call not implement');

  conflux.provider = providerFactory({ url: 'http://localhost:12537', timeout: 30 * 1000 });
  expect(conflux.provider.constructor.name).toEqual('HttpProvider');
  expect(conflux.provider.url).toEqual('http://localhost:12537');
  expect(conflux.provider.timeout).toEqual(30 * 1000);
});
