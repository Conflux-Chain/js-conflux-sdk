const lodash = require('lodash');
const { Hex } = require('../../src/utils/type');
const { encode } = require('../../src/utils/rlp');

test('zero', () => {
  const value = Hex.toBuffer(Hex(0));
  expect(Hex(encode(value))).toEqual('0x80');
});

test('number', () => {
  const value = Hex.toBuffer(Hex(1));
  expect(Hex(encode(value))).toEqual('0x01');
});

test('big endian', () => {
  const value = Hex.toBuffer(Hex(1024));
  expect(Hex(encode(value))).toEqual('0x820400');
});

test('empty buffer', () => {
  const value = Buffer.from('');
  expect(Hex(encode(value))).toEqual('0x80');
});

test('short buffer', () => {
  const value = Buffer.from('dog');
  expect(Hex(encode(value))).toEqual('0x83646f67');
});

test('long buffer', () => {
  const value = Buffer.from(lodash.range(1024).map(() => Buffer.from('')));
  expect(Hex(encode(value).slice(0, 3))).toEqual('0xb90400');
});

test('empty array', () => {
  const value = [];
  expect(Hex(encode(value))).toEqual('0xc0');
});

test('short array', () => {
  const value = [Buffer.from('cat'), Buffer.from([0]), Buffer.from('dog')];
  expect(Hex(encode(value))).toEqual('0xc9836361748083646f67');
});

test('long array', () => {
  const value = lodash.range(1024).map(() => []);
  expect(Hex(encode(value).slice(0, 3))).toEqual('0xf90400');
});

test('nested array', () => {
  const value = [[], [[]], [[], [[]]]];
  expect(Hex(encode(value))).toEqual('0xc7c0c1c0c3c0c1c0');
});
