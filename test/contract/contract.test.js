const JSBI = require('jsbi');
const { Conflux } = require('../../src');
const { format, sign } = require('../../src/util');
const { MockProvider } = require('../../mock');
const { abi, bytecode, address } = require('./contract.json');
const ContractConstructor = require('../../src/contract/ContractConstructor');

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';
const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function sha3(string) {
  return format.hex(sign.sha3(Buffer.from(string)));
}

// ----------------------------------------------------------------------------
const conflux = new Conflux();
conflux.provider = new MockProvider();

const contract = conflux.Contract({ abi, bytecode, address });

console.log(contract);

test('without code', async () => {
  const contractWithoutCode = conflux.Contract({ abi, address });
  expect(() => contractWithoutCode.constructor(100)).toThrow('bytecode is empty');
});

test('with empty abi', () => {
  const contractWithEmptyABI = conflux.Contract({ abi: [], address });
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

  value = await contract.inc(0).options({ from: ADDRESS, nonce: 0 });
  expect(value.toString()).toEqual('100');

  const logs = await contract.SelfEvent(ADDRESS, null).getLogs({ fromEpoch: 0 }); // `fromEpoch` for mock parse
  expect(logs.length).toEqual(2);
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
  error.data = JSON.stringify('0x08c379a0' +
    '0000000000000000000000000000000000000000000000000000000000000020' +
    '0000000000000000000000000000000000000000000000000000000000000005' +
    '4552524f52000000000000000000000000000000000000000000000000000000');
  call.mockRejectedValueOnce(error);
  await expect(contract.count()).rejects.toThrow('ERROR');

  call.mockReturnValueOnce('0x0');
  await expect(contract.count()).rejects.toThrow('length not match');

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
  console.log(event.topics);
  expect(event.topics).toEqual([
    sha3('OverrideEvent(string)'),
    sha3('str'),
  ]);

  event = contract.OverrideEvent(Buffer.from('bytes'));
  expect(event.topics).toEqual([
    sha3('OverrideEvent(bytes)'),
    sha3('bytes'),
  ]);

  event = contract.OverrideEvent(100, null);
  expect(event.topics).toEqual([
    sha3('OverrideEvent(uint256,string)'),
    '0x0000000000000000000000000000000000000000000000000000000000000064',
  ]);

  expect(() => contract.OverrideEvent(100)).toThrow('can not match override "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args (100)');
  expect(() => contract.OverrideEvent(null)).toThrow('can not determine override "OverrideEvent(bytes)|OverrideEvent(string)" with args ()');

  event = contract.OverrideEvent(null, null);
  expect(event.topics).toEqual([
    sha3('OverrideEvent(uint256,string)'),
    null,
  ]);
});

test('contract.StringEvent', () => {
  const { topics } = contract.StringEvent('string');
  expect(topics).toEqual([
    sha3('StringEvent(string)'),
    sha3('string'),
  ]);

  const result = contract.StringEvent.decodeLog({ data: '0x', topics: [topics[0], topics[1]] });
  expect(result).toEqual({
    name: 'StringEvent',
    fullName: 'StringEvent(string indexed _string)',
    type: 'StringEvent(string)',
    signature: sha3('StringEvent(string)'),
    array: [sha3('string')],
    object: {
      _string: sha3('string'),
    },
  });
});

test('contract.ArrayEvent', () => {
  const { topics } = contract.ArrayEvent(HEX_64);
  expect(topics).toEqual([
    sha3('ArrayEvent(string[3])'),
    HEX_64,
  ]);

  expect(() => contract.ArrayEvent(['a', 'b', 'c'])).toThrow('not supported encode array to index');

  const result = contract.ArrayEvent.decodeLog({ data: '0x', topics: [topics[0], topics[1]] });
  expect(result).toEqual({
    name: 'ArrayEvent',
    fullName: 'ArrayEvent(string[3] indexed _array)',
    type: 'ArrayEvent(string[3])',
    signature: sha3('ArrayEvent(string[3])'),
    array: [HEX_64],
    object: {
      _array: HEX_64,
    },
  });
});

test('contract.StructEvent', () => {
  const { topics } = contract.StructEvent(HEX_64);
  expect(topics).toEqual([
    sha3('StructEvent((string,int32))'),
    HEX_64,
  ]);

  expect(() => contract.StructEvent(['Tom', 18])).toThrow('not supported encode tuple to index');

  const result = contract.StructEvent.decodeLog({ data: '0x', topics: [topics[0], topics[1]] });
  expect(result).toEqual({
    name: 'StructEvent',
    fullName: 'StructEvent((string,int32) indexed _struct)',
    type: 'StructEvent((string,int32))',
    signature: sha3('StructEvent((string,int32))'),
    array: [HEX_64],
    object: {
      _struct: HEX_64,
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
    signature: contract.constructor.bytecode,
    array: [JSBI.BigInt(50)],
    object: { num: JSBI.BigInt(50) },
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

test('decodeLog', () => {
  const log = {
    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
    topics: [
      '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      '0x000000000000000000000000a000000000000000000000000000000000000001',
    ],
  };

  const result = contract.abi.decodeLog(log);
  expect(result).toEqual({
    name: 'SelfEvent',
    fullName: 'SelfEvent(address indexed sender, uint256 current)',
    type: 'SelfEvent(address,uint256)',
    signature: '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
    array: ['0xa000000000000000000000000000000000000001', JSBI.BigInt(100)],
    object: {
      sender: '0xa000000000000000000000000000000000000001',
      current: JSBI.BigInt(100),
    },
  });

  expect(contract.abi.decodeLog({ topics: [] })).toEqual(undefined);
});
