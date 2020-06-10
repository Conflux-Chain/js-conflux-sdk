const JSBI = require('jsbi');
const { Conflux } = require('../../src');
const sign = require('../../src/util/sign');
const format = require('../../src/util/format');
const { MockProvider } = require('../../mock');
const { abi, bytecode, address } = require('./contract.json');
const ContractConstructor = require('../../src/contract/ContractConstructor');
/* eslint global-require: 0 */

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';
const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function sha3(string) {
  return format.hex(sign.sha3(Buffer.from(string)));
}

// ----------------------------------------------------------------------------
const cfx = new Conflux({ defaultChainId: 0 });
cfx.provider = new MockProvider();

const contract = cfx.Contract({ abi, bytecode, address });

test('without code', async () => {
  const contractWithoutCode = cfx.Contract({ abi, address });
  expect(() => contractWithoutCode.constructor(100)).toThrow('contract.constructor.bytecode is empty');
});

test('with empty abi', () => {
  const contractWithEmptyABI = cfx.Contract({ abi: [], address });
  expect(contractWithEmptyABI.constructor instanceof ContractConstructor).toEqual(true);
});

test('Contract', async () => {
  let value;

  expect(contract.address).toEqual(address);
  expect(contract.constructor.bytecode).toEqual(bytecode);

  const { contractCreated } = await contract.constructor(100).sendTransaction({ from: ADDRESS, nonce: 0 }).executed();
  expect(contractCreated === null || contractCreated.startsWith('0x')).toEqual(true);

  value = await contract.constructor(100);
  expect(value.startsWith('0x')).toEqual(true);

  value = await contract.count();
  expect(value.toString()).toEqual('100');

  value = await contract.inc(0).call({ from: ADDRESS, nonce: 0 });
  expect(value.toString()).toEqual('100');

  value = await contract.count().estimateGasAndCollateral({ gasPrice: 101 });
  expect(value.gasUsed.constructor).toEqual(JSBI);
  expect(value.storageCollateralized.constructor).toEqual(JSBI);

  const logs = await contract.SelfEvent(ADDRESS, null).getLogs({ fromEpoch: 0 }); // `fromEpoch` for mock parse
  expect(logs.length).toEqual(2);

  const iter = contract.SelfEvent(null, null).getLogs({ toEpoch: 0x00 });
  expect(Boolean(await iter.next({ threshold: 1 }))).toEqual(true);
  expect(Boolean(await iter.next({ threshold: 1 }))).toEqual(true);
  expect(Boolean(await iter.next({ threshold: 1 }))).toEqual(false);
});

test('contract.call', async () => {
  cfx.provider.call = async (method, tx, epochNumber) => {
    expect(method).toEqual('cfx_call');
    expect(tx.to).toEqual(address);
    expect(epochNumber).toEqual('latest_state');
    return '0x00000000000000000000000000000000000000000000000000000000000000ff';
  };

  const value = await contract.count();
  expect(value.toString()).toEqual('255');

  cfx.provider.call = async () => {
    return '0x08c379a0' +
      '0000000000000000000000000000000000000000000000000000000000000020' +
      '0000000000000000000000000000000000000000000000000000000000000005' +
      '4552524f52000000000000000000000000000000000000000000000000000000';
  };
  await expect(contract.count()).rejects.toThrow('ERROR');

  cfx.provider.call = async () => {
    return '0x0';
  };
  await expect(contract.count()).rejects.toThrow('length not match');
});

test('contract.override', () => {
  expect(contract.override('str').coder.type).toEqual('override(string)');
  expect(contract.override(Buffer.from('bytes')).coder.type).toEqual('override(bytes)');
  expect(() => contract.override(100)).toThrow('can not match "override(bytes),override(string),override(uint256,string)"');

  let event;

  expect(() => contract.OverrideEvent()).toThrow('can not match "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args ()');

  event = contract.OverrideEvent('str');
  expect(event.topics).toEqual([
    [sha3('OverrideEvent(string)')],
    [sha3('str')],
  ]);

  event = contract.OverrideEvent(Buffer.from('bytes'));
  expect(event.topics).toEqual([
    [sha3('OverrideEvent(bytes)')],
    [sha3('bytes')],
  ]);

  event = contract.OverrideEvent(100, null);
  expect(event.topics).toEqual([
    [sha3('OverrideEvent(uint256,string)')],
    ['0x0000000000000000000000000000000000000000000000000000000000000064'],
  ]);

  expect(() => contract.OverrideEvent(100)).toThrow('can not match "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args (100)');

  event = contract.OverrideEvent(null);
  expect(event.topics).toEqual([
    [sha3('OverrideEvent(bytes)'), sha3('OverrideEvent(string)')],
    null,
  ]);

  event = contract.OverrideEvent(null, null);
  expect(event.topics).toEqual([
    [sha3('OverrideEvent(uint256,string)')],
    null,
  ]);
});

test('contract.StringEvent', () => {
  const { topics } = contract.StringEvent('string');
  expect(topics).toEqual([
    [sha3('StringEvent(string)')],
    [sha3('string')],
  ]);

  const result = contract.StringEvent.decodeLog({ data: '0x', topics: [topics[0][0], topics[1][0]] });
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
    [sha3('ArrayEvent(string[3])')],
    [HEX_64],
  ]);

  expect(() => contract.ArrayEvent(['a', 'b', 'c'])).toThrow('can not match "ArrayEvent(string[3])" with args (a,b,c)');

  const result = contract.ArrayEvent.decodeLog({ data: '0x', topics: [topics[0][0], topics[1][0]] });
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
    [sha3('StructEvent((string,int32))')],
    [HEX_64],
  ]);

  expect(() => contract.StructEvent(['Tom', 18])).toThrow('can not match "StructEvent((string,int32))" with args (Tom,18)');

  const result = contract.StructEvent.decodeLog({ data: '0x', topics: [topics[0][0], topics[1][0]] });
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
    signature: null,
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

  const dataInput = '0x';
  expect(contract.abi.decodeData(dataInput)).toEqual(undefined);
});

test('decodeData.constructor1', () => {
  const contract1 = cfx.Contract({
    abi: require('../contract/testConstructor1.json').abi,
    bytecode: require('../contract/testConstructor1.json').bytecode,
  });
  const data1 = contract1.constructor('param1-param1-param1-param1-param199', 'param2-param2-param2', 2333, '0xa000000000000000000000000000000000000001', false);
  const contract2 = cfx.Contract({
    abi: require('../contract/testConstructor1.json').abi,
  });

  // const coder0 = getCoder({ type: 'bool' });
  // const hex0 = format.hex(coder0.encode(false))
  // console.log(hex0, 'hex0')

  // const coder1 = getCoder({ type: 'address' });
  // const hex1 = format.hex(coder1.encode('0xa000000000000000000000000000000000000001'));
  // console.log(hex1, 'hex1')

  // const coder2 = getCoder({ type: 'uint' });
  // const hex3 = format.hex(coder2.encode(2333));
  // console.log(hex3, 'hex2')

  // const coder3 = getCoder({ type: 'string' });
  // const hex4 = format.hex(coder3.encode('param2-pparam2-param2'));
  // console.log(hex4, 'hex3')

  // const coder4 = getCoder({ type: 'string' });
  // const hex5 = format.hex(coder4.encode('param1-param1-param1-param1-param199'));
  // console.log(hex5, 'hex4')

  const result = contract2.abi.decodeData(data1.data);
  expect(result).toEqual({
    name: 'constructor',
    fullName: 'constructor(string param1, string param2, uint256 param3, address param4, bool param5)',
    type: 'constructor(string,string,uint256,address,bool)',
    signature: null,
    array: [
      'param1-param1-param1-param1-param199-param199-param199-param199',
      'param2-param2-param2',
      JSBI.BigInt(2333),
      '0xa000000000000000000000000000000000000001',
      false,
    ],
    object: {
      param1: 'param1-param1-param1-param1-param199-param199-param199-param199',
      param2: 'param2-param2-param2',
      param3: JSBI.BigInt(2333),
      param4: '0xa000000000000000000000000000000000000001',
      param5: false,
    },
  });
});


test.only('decodeData.constructor2', () => {
  const contract1 = cfx.Contract({
    abi: require('../contract/testConstructor2.json').abi,
    bytecode: require('../contract/testConstructor2.json').bytecode,
  });

  const params = [
    [
      'param1-param1-param1-param1-param299',
      'param1-param1-param1-param1-param299-param1-param1-param1-param1-param299-param1-param1-param1-param1-param299',
      'param1-param1-param1-param1-param299',
      'param1-param1-param1-param1-param299',
      'param1-param1-param1-param1-param299中文汉字测试123123123测试中文汉字测试123123123测试中文汉字测试123123123测试',
      'param1-param1-param1-param1-param299',
      'param1-param1-param1-param1-param299',
      'param1-param1-param1-param1-param299',
    ],
    [
      'param2-param2-param2',
    ],
    2333,
    [
      '0xa000000000000000000000000000000000000001',
      '0xa000000000000000000000000000000000000002',
    ],
    false,
  ];

  const data1 = contract1.constructor(...params);
  const contract2 = cfx.Contract({
    abi: require('../contract/testConstructor2.json').abi,
  });
  const result = contract2.abi.decodeData(data1.data, true);
  expect(result).toMatchObject({
    name: 'constructor',
    signature: null,
    array: [
      params[0],
      params[1],
      JSBI.BigInt(params[2]),
      params[3],
      params[4],
    ],
    object: {
      param1: params[0],
      param2: params[1],
      param3: JSBI.BigInt(params[2]),
      param4: params[3],
      param5: params[4],
    },
  });
});


test('decodeData.constructor3', () => {
  const contract1 = cfx.Contract({
    abi: require('../contract/testConstructor3.json').abi,
    bytecode: require('../contract/testConstructor3.json').bytecode,
  });
  const params = [
    [
      'param1-param1-param1-param1-param299',
    ],
    [
      'param2-param2-param2',
      'param1-param1-param1-param1-param299-param1-param1-param1-param1-param299-param1-param1-param1-param1-param299',
    ],
    2333,
    [
      '0xa000000000000000000000000000000000000001',
      '0xa000000000000000000000000000000000000002',
    ],
    false,
  ];
  const data1 = contract1.constructor(...params);
  const contract2 = cfx.Contract({
    abi: require('../contract/testConstructor3.json').abi,
  });

  const result = contract2.abi.decodeData(data1.data, true);
  console.log(result, 'result');
  expect(result).toMatchObject({
    name: 'constructor',
    signature: null,
    array: [
      params[0],
      params[1],
      JSBI.BigInt(params[2]),
      params[3],
      params[4],
    ],
    object: {
      param1: params[0],
      param2: params[1],
      param3: JSBI.BigInt(params[2]),
      param4: params[3],
      param5: params[4],
    },
  });
});


test('decodeData.constructor4', () => {
  const contract1 = cfx.Contract({
    abi: require('../contract/testConstructor4.json').abi,
    bytecode: require('../contract/testConstructor4.json').bytecode,
  });
  const params = [
    [
      'param1-param1-param1-param1-param299',
    ],
    [
      'param2-param2-param2',
      'param1-param1-param1-param1-param299-param1-param1-param1-param1-param299-param1-param1-param1-param1-param299',
    ],
    2333,
    [
      '0xa000000000000000000000000000000000000001',
      '0xa000000000000000000000000000000000000002',
    ],
    false,

  ];
  const data1 = contract1.constructor(...params);
  const contract2 = cfx.Contract({
    abi: require('../contract/testConstructor4.json').abi,
  });
  const result = contract2.abi.decodeData(data1.data, true);
  expect(result).toMatchObject({
    name: 'constructor',
    signature: null,
    array: [
      params[0],
      params[1],
      JSBI.BigInt(params[2]),
      params[3],
      params[4],
    ],
    object: {
      param1: params[0],
      param2: params[1],
      param3: JSBI.BigInt(params[2]),
      param4: params[3],
      param5: params[4],
    },
  });
});


test('decodeData.constructor5', () => {
  const contract1 = cfx.Contract({
    abi: require('../contract/testConstructor5.json').abi,
    bytecode: require('../contract/testConstructor5.json').bytecode,
  });
  const params = [
    [
      'param1-param1-param1-param1-param299',
    ],
    [
      'param2-param2-param2',
      'param1-param1-param1-param1-param299-param1-param1-param1-param1-param299-param1-param1-param1-param1-param299',
    ],
    2333,
    [
      '0xa000000000000000000000000000000000000001',
      '0xa000000000000000000000000000000000000002',
    ],
    false,
  ];
  const data1 = contract1.constructor(...params);
  const contract2 = cfx.Contract({
    abi: require('../contract/testConstructor5.json').abi,
  });
  const result = contract2.abi.decodeData(data1.data, true);
  expect(result).toMatchObject({
    name: 'constructor',
    signature: null,
    array: [
      params[0],
      params[1],
      JSBI.BigInt(params[2]),
      params[3],
      params[4],
    ],
    object: {
      param1: params[0],
      param2: params[1],
      param3: JSBI.BigInt(params[2]),
      param4: params[3],
      param5: params[4],
    },
  });
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
