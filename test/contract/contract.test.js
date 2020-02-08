const JSBI = require('jsbi');
const { Conflux } = require('../../src');
const { MockProvider } = require('../../mock');
const { abi, code, address } = require('./contract.json');

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

// ----------------------------------------------------------------------------
const cfx = new Conflux({
  defaultGasPrice: 100,
  defaultGas: 1000000,
});
cfx.provider = new MockProvider();

const contract = cfx.Contract({ abi, code, address });

test('without code', async () => {
  const contractWithoutCode = cfx.Contract({ abi, address });
  expect(() => contractWithoutCode.constructor(100)).toThrow('contract.constructor.code is empty');
});

test('Contract', async () => {
  let value;

  expect(contract.address).toEqual(address);
  expect(contract.constructor.code).toEqual(code);

  const { contractCreated } = await contract.constructor(100).sendTransaction({ from: ADDRESS, nonce: 0 }).confirmed();
  expect(contractCreated === null || contractCreated.startsWith('0x')).toEqual(true);

  value = await contract.constructor(100);
  expect(value.startsWith('0x')).toEqual(true);

  value = await contract.count();
  expect(value.toString()).toEqual('100');

  value = await contract.inc(0).call({ from: ADDRESS, nonce: 0 });
  expect(value.toString()).toEqual('100');

  value = await contract.count().estimateGas({ gasPrice: 101 });
  expect(value.constructor).toEqual(JSBI);

  const logs = await contract.SelfEvent(ADDRESS).getLogs();
  expect(logs.length).toEqual(2);

  const iter = contract.SelfEvent(undefined, 10).getLogs({ toEpoch: 0x00 });
  expect(Boolean(await iter.next())).toEqual(true);
  expect(Boolean(await iter.next())).toEqual(true);
  expect(Boolean(await iter.next())).toEqual(false);
});

test('decodeData.constructor', () => {
  const data = contract.constructor(50).data;

  const value = contract.abi.decodeData(data);
  expect(value.name).toEqual('constructor');
  expect(value.params.length).toEqual(1);
  expect(value.params[0]).toEqual(JSBI.BigInt(50));
});

test('decodeData.function', () => {
  const data = contract.inc(100).data;

  const value = contract.abi.decodeData(data);
  expect(value.name).toEqual('inc');
  expect(value.params.length).toEqual(1);
  expect(value.params[0]).toEqual(JSBI.BigInt(100));

  expect(contract.abi.decodeData('0x')).toEqual(undefined);
});

test('decodeLog', () => {
  const log = {
    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
    topics: [
      '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      '0x000000000000000000000000a000000000000000000000000000000000000001',
    ],
  };

  const value = contract.abi.decodeLog(log);
  expect(value.name).toEqual('SelfEvent');
  expect(value.params.length).toEqual(2);
  expect(value.params[0]).toEqual('0xa000000000000000000000000000000000000001');
  expect(value.params[1]).toEqual(JSBI.BigInt(100));

  expect(contract.abi.decodeLog({ topics: [] })).toEqual(undefined);
});
