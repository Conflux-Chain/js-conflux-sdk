const BigNumber = require('bignumber.js');
const format = require('../../src/util/format');

const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const HEX_40 = '0x0123456789012345678901234567890123456789';

test('hex(null)', () => {
  expect(format.hex(null)).toEqual('0x');

  expect(() => format.hex()).toThrow('not match hex');
  expect(() => format.hex(undefined)).toThrow('not match hex');
});

test('hex(Number)', () => {
  expect(() => format.hex(-1)).toThrow('not match hex');
  expect(format.hex(0)).toEqual('0x00');
  expect(format.hex(1)).toEqual('0x01');
  expect(() => format.hex(3.14)).toThrow('not match hex');
  expect(format.hex(256)).toEqual('0x0100');
  expect(format.hex(0x1fffffffffffff)).toEqual('0x1fffffffffffff');
});

test('hex(BigNumber)', () => {
  expect(() => format.hex(BigNumber(-1))).toThrow('not match hex');
  expect(format.hex(BigNumber(0))).toEqual('0x00');
  expect(format.hex(BigNumber(1))).toEqual('0x01');
  expect(() => format.hex(BigNumber(3.14))).toThrow('not match hex');
  expect(format.hex(BigNumber(256))).toEqual('0x0100');
  expect(format.hex(BigNumber(0x1fffffffffffff))).toEqual('0x1fffffffffffff');

  expect(() => format.hex(BigNumber(0.01).times(10))).toThrow('not match hex');
  expect(format.hex(BigNumber(0.01).times(1e9).times(1e9))).toEqual('0x2386f26fc10000');
});

test('hex(Buffer)', () => {
  expect(format.hex(Buffer.from([]))).toEqual('0x');
  expect(format.hex(Buffer.from([1, 10, 255]))).toEqual('0x010aff');
});

test('hex(bool)', () => {
  expect(format.hex(false)).toEqual('0x00');
  expect(format.hex(true)).toEqual('0x01');
  expect(() => format.hex('true')).toThrow('not match hex');
});

test('hex(string)', () => {
  expect(() => format.hex('')).toThrow('not match hex');
  expect(format.hex('0x')).toEqual('0x');

  expect(format.hex('0x1234')).toEqual('0x1234');
  expect(() => format.hex('1234')).toThrow('not match hex');

  expect(format.hex('0x0a')).toEqual('0x0a');
  expect(() => format.hex('0xa')).toThrow('not match hex');
  expect(() => format.hex('a')).toThrow('not match hex');
  expect(() => format.hex(' a')).toThrow('not match hex');
  expect(() => format.hex('a ')).toThrow('not match hex');
  expect(() => format.hex('0x0A')).toThrow('not match hex');
});

test('number', () => {
  expect(format.number(-3.14)).toEqual(-3.14);
  expect(format.number(BigNumber(-3.14))).toEqual(-3.14);

  expect(format.number('-3.14')).toEqual(-3.14);
  expect(format.number('0x10')).toEqual(16);
  expect(() => format.number('')).toThrow('not match number');

  expect(format.number(false)).toEqual(0);
  expect(format.number(true)).toEqual(1);
  expect(() => format.number('true')).toThrow('not match number');

  expect(() => format.number(null)).toThrow('not match number');
});

test('uint', () => {
  expect(() => format.uint(-1)).toThrow('not match uint');
  expect(format.uint(BigNumber(0))).toEqual(0);
  expect(format.uint(1)).toEqual(1);
  expect(format.uint('0x10')).toEqual(16);
  expect(format.uint(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
  expect(() => format.uint(Number.MAX_SAFE_INTEGER + 1)).toThrow('not match uint');
});

test('bigNumber', () => {
  expect(format.bigNumber(-3.14)).toEqual(BigNumber(-3.14));
  expect(format.bigNumber(BigNumber(-3.14))).toEqual(BigNumber(-3.14));

  expect(format.bigNumber('-3.14')).toEqual(BigNumber(-3.14));
  expect(format.bigNumber('0x10')).toEqual(BigNumber(16));
  expect(() => format.bigNumber('')).toThrow('not match bigNumber');

  expect(format.bigNumber(false)).toEqual(BigNumber(0));
  expect(format.bigNumber(true)).toEqual(BigNumber(1));
  expect(() => format.bigNumber('true')).toThrow('not match bigNumber');

  expect(() => format.bigNumber(null)).toThrow('not match bigNumber');
});

test('hexNumber', () => {
  expect(format.hexNumber(100)).toEqual('0x64');
  expect(format.hexNumber(BigNumber(10))).toEqual('0xa');
  expect(format.hexNumber(3.50)).toEqual('0x4');
  expect(format.hexNumber(3.49)).toEqual('0x3');
  expect(format.hexNumber(-0.49)).toEqual('0x0');
  expect(() => format.hexNumber(-0.5)).toThrow('not match hexNumber');
  expect(() => format.hexNumber(-1)).toThrow('not match hexNumber');
});

test('epochNumber', () => {
  expect(() => format.epochNumber(-1)).toThrow('not match hex');
  expect(format.epochNumber(0)).toEqual('0x00');
  expect(format.epochNumber('latest_mined')).toEqual('latest_mined');
  expect(format.epochNumber('latest_state')).toEqual('latest_state');
  expect(() => format.epochNumber('LATEST_MINED')).toThrow('not match hex');
});

test('hex40', () => {
  expect(format.hex40(HEX_40)).toEqual(HEX_40);
  expect(() => format.hex40(HEX_64)).toThrow('not match hex40');

  expect(format.address(HEX_40)).toEqual(HEX_40);
  expect(() => format.address(HEX_64)).toThrow('not match hex40');
});

test('hex64', () => {
  expect(format.hex64(HEX_64)).toEqual(HEX_64);
  expect(() => format.hex64(HEX_40)).toThrow('not match hex64');

  expect(format.privateKey(HEX_64)).toEqual(HEX_64);
  expect(() => format.privateKey(HEX_40)).toThrow('not match hex64');

  expect(format.blockHash(HEX_64)).toEqual(HEX_64);
  expect(() => format.blockHash(HEX_40)).toThrow('not match hex64');

  expect(format.txHash(HEX_64)).toEqual(HEX_64);
  expect(() => format.txHash(HEX_40)).toThrow('not match hex64');
});

test('buffer', () => {
  expect(() => format.buffer(undefined)).toThrow('not match hex');

  expect(format.buffer(Buffer.from([0, 1]))).toEqual(Buffer.from([0, 1]));

  expect(format.buffer(null)).toEqual(Buffer.from([]));

  expect(format.buffer(0)).toEqual(Buffer.from([0]));
  expect(() => format.buffer(3.14)).toThrow('not match hex');
  expect(format.buffer(1024)).toEqual(Buffer.from([4, 0]));
  expect(format.buffer(BigNumber(1))).toEqual(Buffer.from([1]));
  expect(format.buffer('0x0a')).toEqual(Buffer.from([10]));

  expect(format.buffer(false)).toEqual(Buffer.from([0]));
  expect(format.buffer(true)).toEqual(Buffer.from([1]));
});
