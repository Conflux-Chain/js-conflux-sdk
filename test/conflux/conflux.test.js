const { EpochNumber } = require('../../src/utils/type');
const Conflux = require('../../src');

// ----------------------------------------------------------------------------

test('constructor()', async () => {
  const cfx = new Conflux();

  expect(cfx.defaultEpoch).toEqual(EpochNumber.LATEST_STATE);
  expect(cfx.defaultGasPrice).toEqual(undefined);
  expect(cfx.defaultGas).toEqual(undefined);
  expect(cfx.provider.constructor.name).toEqual('BaseProvider');

  await expect(cfx.provider.call()).rejects.toThrow('call not implement');
});

test('constructor({...})', () => {
  const cfx = new Conflux({
    url: 'http://localhost:12537',
    defaultEpoch: EpochNumber.LATEST_MINED,
    defaultGasPrice: 100,
    defaultGas: 1000000,
  });

  expect(cfx.defaultEpoch).toEqual(EpochNumber.LATEST_MINED);
  expect(cfx.defaultGasPrice).toEqual(100);
  expect(cfx.defaultGas).toEqual(1000000);
  expect(cfx.provider.constructor.name).toEqual('HttpProvider');
});

test('cfx.setProvider', () => {
  const cfx = new Conflux();

  expect(cfx.provider.constructor.name).toEqual('BaseProvider');
  expect(cfx.provider.timeout).toEqual(5 * 60 * 1000);

  cfx.setProvider('http://localhost:80', { timeout: 30 * 1000 });
  expect(cfx.provider.constructor.name).toEqual('HttpProvider');
  expect(cfx.provider.timeout).toEqual(30 * 1000);

  cfx.setProvider('http://localhost:80', { timeout: 60 * 1000 });
  expect(cfx.provider.constructor.name).toEqual('HttpProvider');
  expect(cfx.provider.timeout).toEqual(60 * 1000);

  cfx.setProvider('');
  expect(cfx.provider.constructor.name).toEqual('BaseProvider');
  expect(cfx.provider.timeout).toEqual(60 * 1000);

  expect(() => cfx.setProvider()).toThrow('url must be string');
});

test('cfx.close', () => {
  const cfx = new Conflux();

  cfx.close();
});
