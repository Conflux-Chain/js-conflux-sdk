const JSBI = require('../../src/util/jsbi');
const { Conflux, Contract, format } = require('../../src');
const { MockProvider } = require('../../mock');
const { abi, bytecode, address } = require('./contract.json');
const ContractConstructor = require('../../src/contract/method/ContractConstructor');

const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
const HEX64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// ----------------------------------------------------------------------------
const conflux = new Conflux({ networkId: 1 });
conflux.provider = new MockProvider();

const contract = conflux.Contract({ abi, bytecode, address });

test('without code', async () => {
  const contractWithoutCode = new Contract({ abi, address });
  expect(() => contractWithoutCode.constructor(100)).toThrow('bytecode is empty');
});

test('with empty abi', () => {
  const contractWithEmptyABI = new Contract({ abi: [], address });
  expect(contractWithEmptyABI.constructor instanceof ContractConstructor).toEqual(true);
});

test('Contract', async () => {
  let value;

  expect(contract.address).toEqual(address);
  expect(contract.constructor.bytecode).toEqual(bytecode);

  value = await contract.constructor(100);
  expect(value.startsWith('0x')).toEqual(true);

  value = await contract.count();
  expect(value.toString()).toEqual('100');

//   value = await contract.inc(0).call({ from: ADDRESS, nonce: 0 });
//   expect(value.toString()).toEqual('100');
});

test('Internal Contract', async () => {
  const adminControl = conflux.InternalContract('AdminControl');
  expect(adminControl.address).toEqual('0x0888000000000000000000000000000000000000');

  const sponsorWhitelistControl = conflux.InternalContract('SponsorWhitelistControl');
  expect(sponsorWhitelistControl.address).toEqual('0x0888000000000000000000000000000000000001');

  const staking = conflux.InternalContract('Staking');
  expect(staking.address).toEqual('0x0888000000000000000000000000000000000002');

  expect(() => conflux.InternalContract('xxx')).toThrow('can not find internal contract');
});

test('contract.call', async () => {
  const call = jest.spyOn(conflux.provider, 'call');
  call.mockReturnValueOnce('0x00000000000000000000000000000000000000000000000000000000000000ff');

  const value = await contract.count();
  expect(value.toString()).toEqual('255');

  expect(call).toHaveBeenLastCalledWith('cfx_call', {
    to: address,
    data: '0x06661abd',
  }, undefined);

  const error = new Error();
  error.data = '0x08c379a0' +
    '0000000000000000000000000000000000000000000000000000000000000020' +
    '0000000000000000000000000000000000000000000000000000000000000005' +
    '4552524f52000000000000000000000000000000000000000000000000000000';
  call.mockRejectedValueOnce(error);
  await expect(contract.count()).rejects.toThrow('ERROR');

  call.mockReturnValueOnce('0x0');
  await expect(contract.count()).rejects.toThrow('length not match');

  call.mockRestore();
});

test('contract.call catch', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  call.mockReturnValueOnce('0x00000000000000000000000000000000000000000000000000000000000000ff');
  const value = await contract.count().catch(v => v);
  expect(`${value}`).toEqual('255');

  call.mockRejectedValueOnce(new Error('XXX'));
  const error = await contract.count().catch(v => v);
  expect(error.message).toEqual('XXX');

  call.mockRestore();
});

test('contract.call finally', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  let called;

  called = false;
  await contract.count().finally(() => {
    called = true;
  });
  expect(called).toEqual(true);

  called = false;
  call.mockRejectedValueOnce(new Error('XXX'));
  await expect(
    contract.count().finally(() => {
      called = true;
    }),
  ).rejects.toThrow('XXX');
  expect(called).toEqual(true);

  call.mockRestore();
});

test('contract.estimateGasAndCollateral', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  await contract.count().estimateGasAndCollateral({});

  expect(call).toHaveBeenLastCalledWith('cfx_estimateGasAndCollateral', {
    to: address,
    data: '0x06661abd',
  }, undefined);

  call.mockRestore();
});

test('contract.sendTransaction', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  await contract.count().sendTransaction({ from: ADDRESS, gasPrice: 0, gas: 0, storageLimit: 0, chainId: 1 });

  expect(call).toHaveBeenLastCalledWith('cfx_sendTransaction', {
    from: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
    to: address,
    data: '0x06661abd',
    gasPrice: '0x0',
    gas: '0x0',
    storageLimit: '0x0',
    chainId: '0x1',
  }, undefined);

  call.mockRestore();
});

test('contract.getLogs', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  const topics = [format.keccak256('StringEvent(string)'), format.keccak256('string')];
  call.mockReturnValueOnce([
    {
      epochNumber: '0x0',
      logIndex: '0x0',
      transactionIndex: '0x0',
      transactionLogIndex: '0x0',
      topics,
      data: '0x',
    },
  ]);

  const result = await contract.StringEvent('string').getLogs();
  expect(result[0].arguments).toEqual([topics[1]]);

  expect(call).toHaveBeenLastCalledWith('cfx_getLogs', { address, topics });

  call.mockRestore();
});

test('contract.override', () => {
  expect(contract.override(Buffer.from('bytes')).method.type).toEqual('override(bytes)');

  expect(() => contract.override('str')).toThrow('can not determine override "override(bytes)|override(string)" with args (str)');
  expect(contract['override(string)']('str').method.type).toEqual('override(string)');
  expect(contract['0x227ffd52']('str').method.type).toEqual('override(string)');

  expect(() => contract.override(100)).toThrow('can not match override "override(bytes)|override(string)|override(uint256,string)" with args (100)');

  let event;

  expect(() => contract.OverrideEvent()).toThrow('can not match override "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args ()');

  event = contract.OverrideEvent('str');
  expect(event.topics).toEqual([
    format.keccak256('OverrideEvent(string)'),
    format.keccak256('str'),
  ]);

  event = contract.OverrideEvent(Buffer.from('bytes'));
  expect(event.topics).toEqual([
    format.keccak256('OverrideEvent(bytes)'),
    format.keccak256('bytes'),
  ]);

  event = contract.OverrideEvent(100, null);
  expect(event.topics).toEqual([
    format.keccak256('OverrideEvent(uint256,string)'),
    '0x0000000000000000000000000000000000000000000000000000000000000064',
  ]);

  expect(() => contract.OverrideEvent(100)).toThrow('can not match override "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args (100)');
  expect(() => contract.OverrideEvent(null)).toThrow('can not determine override "OverrideEvent(bytes)|OverrideEvent(string)" with args ()');

  event = contract.OverrideEvent(null, null);
  expect(event.topics).toEqual([
    format.keccak256('OverrideEvent(uint256,string)'),
    null,
  ]);

  const result = contract.OverrideEvent.decodeLog({
    topics: [
      format.keccak256('OverrideEvent(string)'),
      format.keccak256('str'),
    ],
    data: '0x',
  });
  expect(result[0]).toEqual(format.keccak256('str'));
});

test('contract.StringEvent', () => {
  const { topics } = contract.StringEvent('string');
  expect(topics).toEqual([
    format.keccak256('StringEvent(string)'),
    format.keccak256('string'),
  ]);

  const result = contract.abi.decodeLog({ data: '0x', topics });
  expect(result).toEqual({
    name: 'StringEvent',
    fullName: 'StringEvent(string indexed _string)',
    type: 'StringEvent(string)',
    signature: format.keccak256('StringEvent(string)'),
    array: [format.keccak256('string')],
    object: {
      _string: format.keccak256('string'),
    },
  });
});

test('contract.ArrayEvent', () => {
  const { topics } = contract.ArrayEvent(HEX64);
  expect(topics).toEqual([
    format.keccak256('ArrayEvent(string[3])'),
    HEX64,
  ]);

  expect(() => contract.ArrayEvent(['a', 'b', 'c'])).toThrow('not supported encode array to index');

  const result = contract.abi.decodeLog({ data: '0x', topics });
  expect(result).toEqual({
    name: 'ArrayEvent',
    fullName: 'ArrayEvent(string[3] indexed _array)',
    type: 'ArrayEvent(string[3])',
    signature: format.keccak256('ArrayEvent(string[3])'),
    array: [HEX64],
    object: {
      _array: HEX64,
    },
  });
});

test('contract.StructEvent', () => {
  const { topics } = contract.StructEvent(HEX64);
  expect(topics).toEqual([
    format.keccak256('StructEvent((string,int32))'),
    HEX64,
  ]);

  expect(() => contract.StructEvent(['Tom', 18])).toThrow('not supported encode tuple to index');

  const result = contract.abi.decodeLog({ data: '0x', topics });
  expect(result).toEqual({
    name: 'StructEvent',
    fullName: 'StructEvent((string,int32) indexed _struct)',
    type: 'StructEvent((string,int32))',
    signature: format.keccak256('StructEvent((string,int32))'),
    array: [HEX64],
    object: {
      _struct: HEX64,
    },
  });
});

test('decodeData.constructor', () => {
  const data = contract.constructor(50).data;

  const result = contract.abi.decodeData(data);
  expect(result).toEqual({
    name: 'constructor',
    fullName: 'constructor(uint256 num)',
    type: 'constructor(uint256)',
    signature: '',
    array: [JSBI.BigInt(50)],
    object: {
      num: JSBI.BigInt(50),
    },
  });
});

test('decodeData.function', () => {
  const data = contract.inc(100).data;

  const result = contract.abi.decodeData(data);
  expect(result).toEqual({
    name: 'inc',
    fullName: 'inc(uint256 num)',
    type: 'inc(uint256)',
    signature: '0x812600df',
    array: [JSBI.BigInt(100)],
    object: {
      num: JSBI.BigInt(100),
    },
  });

  expect(contract.abi.decodeData('0x')).toEqual(undefined);
});

test('decodeData.override', () => {
  const data = contract.override(Buffer.from('bytes')).data;

  const tuple = contract.override.decodeData(data);

  expect(tuple[0]).toEqual(Buffer.from('bytes'));
});

test('decodeLog', () => {
  const log = {
    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
    topics: [
      '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      '0x0000000000000000000000001000000000000000000000000000000000000001',
    ],
  };

  const result = contract.abi.decodeLog(log);
  expect(result).toEqual({
    name: 'SelfEvent',
    fullName: 'SelfEvent(address indexed sender, uint256 current)',
    type: 'SelfEvent(address,uint256)',
    signature: '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
    array: ['cfxtest:aajaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaec1w82azf', JSBI.BigInt(100)],
    object: {
      sender: 'cfxtest:aajaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaec1w82azf',
      current: JSBI.BigInt(100),
    },
  });

  expect(contract.abi.decodeLog({ topics: [] })).toEqual(undefined);
});
