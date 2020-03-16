const JSBI = require('jsbi');
const { formatSignature, FunctionCoder, EventCoder } = require('../../src/abi');

test('function', () => {
  const abi = {
    name: 'func',
    inputs: [
      { type: 'int' },
      {
        type: 'tuple',
        components: [
          { type: 'address' },
          { type: 'string[]' },
        ],
      },
      {
        type: 'tuple',
        components: [
          {
            type: 'tuple',
            components: [
              { type: 'int' },
              { type: 'int' },
            ],
          },
          { type: 'bool' },
        ],
      },
    ],
    outputs: [
      {
        type: 'uint256',
      },
    ],
  };

  const params = [
    JSBI.BigInt(-1),
    ['0x0123456789012345678901234567890123456789', ['Hello', 'World']],
    [[JSBI.BigInt(0xab), JSBI.BigInt(0xcd)], true],
  ];

  const hex = '0x' +
    'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' +
    '00000000000000000000000000000000000000000000000000000000000000a0' +
    '00000000000000000000000000000000000000000000000000000000000000ab' +
    '00000000000000000000000000000000000000000000000000000000000000cd' +
    '0000000000000000000000000000000000000000000000000000000000000001' +
    '0000000000000000000000000123456789012345678901234567890123456789' +
    '0000000000000000000000000000000000000000000000000000000000000040' +
    '0000000000000000000000000000000000000000000000000000000000000002' +
    '0000000000000000000000000000000000000000000000000000000000000040' +
    '0000000000000000000000000000000000000000000000000000000000000080' +
    '0000000000000000000000000000000000000000000000000000000000000005' +
    '48656c6c6f000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000000000000000000000000000000000000000000005' +
    '576f726c64000000000000000000000000000000000000000000000000000000';

  const coder = new FunctionCoder(abi);
  expect(formatSignature(abi)).toEqual('func(int256,(address,string[]),((int256,int256),bool))');
  expect(coder.signature()).toEqual('0x664b7e11');
  expect(coder.encodeInputs(params)).toEqual(hex);
  expect(coder.decodeInputs(hex)).toEqual(params);
  expect(coder.decodeOutputs('0x0000000000000000000000000000000000000000000000000000000000000001'))
    .toEqual([JSBI.BigInt(1)]);
});

test('event', () => {
  const abi = {
    name: 'EventName',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
  };

  const log = {
    data: '0x000000000000000000000000000000000000000000000000000000000000000a',
    topics: [
      '0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7',
      '0x0000000000000000000000000123456789012345678901234567890123456789',
    ],
  };

  const coder = new EventCoder(abi);
  expect(coder.signature()).toEqual('0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7');

  expect(coder.encodeTopics(['0x0123456789012345678901234567890123456789', null]))
    .toEqual(['0x0000000000000000000000000123456789012345678901234567890123456789']);

  expect(() => coder.encodeTopics(['0x0123456789012345678901234567890123456789']))
    .toThrow('length not match');

  expect([...coder.decodeLog(log)])
    .toEqual(['0x0123456789012345678901234567890123456789', JSBI.BigInt(10)]);
});

test('event.anonymous', () => {
  const abi = {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
  };

  const log = {
    data: '0x000000000000000000000000000000000000000000000000000000000000000a',
    topics: [
      '0x0000000000000000000000000123456789012345678901234567890123456789',
    ],
  };

  const coder = new EventCoder(abi);
  expect([...coder.decodeLog(log)])
    .toEqual(['0x0123456789012345678901234567890123456789', JSBI.BigInt(10)]);
});
