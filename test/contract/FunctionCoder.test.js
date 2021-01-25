const JSBI = require('../../src/util/jsbi');
const FunctionCoder = require('../../src/contract/method/FunctionCoder');

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

  const hex = '0x664b7e11' +
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
  expect(coder.signature).toEqual('0x664b7e11');
  expect(coder.type).toEqual('func(int256,(address,string[]),((int256,int256),bool))');
  expect(coder.encodeData(params)).toEqual(hex);
  // expect(coder.decodeData(hex)).toEqual(params);
  expect(coder.decodeOutputs('0x0000000000000000000000000000000000000000000000000000000000000001')).toEqual(JSBI.BigInt(1));
});

test('function not inputs many outputs', () => {
  const abi = {
    name: 'func',
    outputs: [
      {
        type: 'address',
        name: 'account',
        networkId: 1,
      },
      {
        type: 'uint256',
        name: 'number',
      },
    ],
  };

  const coder = new FunctionCoder(abi);

  const tuple = coder.decodeOutputs('0x' +
    '0000000000000000000000000123456789012345678901234567890123456789' +
    '0000000000000000000000000000000000000000000000000000000000000001',
  );
  expect([...tuple]).toEqual(['cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp', JSBI.BigInt(1)]);
  expect(tuple.toObject()).toEqual({
    account: 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp',
    number: JSBI.BigInt(1),
  });
});
