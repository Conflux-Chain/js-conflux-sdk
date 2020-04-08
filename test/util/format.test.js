const JSBI = require('jsbi');
const format = require('../../src/util/format');

const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const HEX_40 = '0x0123456789012345678901234567890123456789';

test('any', () => {
  expect(format.any()).toEqual(undefined);
  expect(format.any(null)).toEqual(null);
  expect(format.any(1)).toEqual(1);
  expect(format.any(true)).toEqual(true);
  expect(format.any('string')).toEqual('string');
});

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
  expect(format.hex('0X0A')).toEqual('0x0a');
  expect(format.hex('0xa')).toEqual('0x0a');
  expect(() => format.hex('a')).toThrow('not match hex');
  expect(() => format.hex(' a')).toThrow('not match hex');
  expect(() => format.hex('a ')).toThrow('not match hex');
});

test('uint', () => {
  expect(() => format.uInt()).toThrow('not match uint');
  expect(() => format.uInt(null)).toThrow('not match number');
  expect(() => format.uInt(3.14)).toThrow('not match uint');
  expect(() => format.uInt('3.14')).toThrow('not match uint');
  expect(() => format.uInt(-1)).toThrow('not match uint');
  expect(format.uInt(0)).toEqual(0);
  expect(format.uInt(1)).toEqual(1);
  expect(format.uInt(3.00)).toEqual(3);
  expect(format.uInt('3.00')).toEqual(3);
  expect(format.uInt(JSBI.BigInt(100))).toEqual(100);
  expect(format.uInt('0x10')).toEqual(16);
  expect(format.uInt(true)).toEqual(1);
  expect(format.uInt(false)).toEqual(0);
  expect(format.uInt('')).toEqual(0);
  expect(format.uInt(Buffer.from([0, 1, 2]))).toEqual(0x102);
  expect(() => format.uInt(Number.MAX_SAFE_INTEGER + 1)).toThrow('not match uint');
  expect(() => format.uInt(Infinity)).toThrow('not match uint');
});

test('bigInt', () => {
  expect(() => format.bigInt(3.14)).toThrow('cannot be converted to');
  expect(() => format.bigInt('3.14')).toThrow('Cannot convert 3.14 to a BigInt');
  expect(format.bigInt('-1')).toEqual(JSBI.BigInt(-1));
  expect(format.bigInt('0')).toEqual(JSBI.BigInt(0));
  expect(format.bigInt(1)).toEqual(JSBI.BigInt(1));
  expect(format.bigInt(3.00)).toEqual(JSBI.BigInt(3));
  expect(format.bigInt('3.00')).toEqual(JSBI.BigInt(3));
  expect(format.bigInt('0x10')).toEqual(JSBI.BigInt(16));
  expect(format.bigInt(Buffer.from([0, 1, 2]))).toEqual(JSBI.BigInt(0x102));
  expect(format.bigInt(Number.MAX_SAFE_INTEGER + 1)).toEqual(JSBI.BigInt(2 ** 53));
});

test('bigUInt', () => {
  expect(() => format.bigUInt(3.14)).toThrow('cannot be converted to');
  expect(() => format.bigUInt('3.14')).toThrow('Cannot convert 3.14 to a BigInt');
  expect(() => format.bigUInt(-1)).toThrow('not match bigUInt');
  expect(() => format.bigUInt('-1')).toThrow('not match bigUInt');
  expect(format.bigUInt('0')).toEqual(JSBI.BigInt(0));
  expect(format.bigUInt('0.0')).toEqual(JSBI.BigInt(0));
});

test('hexUInt', () => {
  expect(format.hexUInt(false)).toEqual('0x0');
  expect(format.hexUInt(true)).toEqual('0x1');
  expect(format.hexUInt('')).toEqual('0x0');
  expect(format.hexUInt(100)).toEqual('0x64');
  expect(format.hexUInt('10')).toEqual('0xa');
  expect(format.hexUInt(Buffer.from([0, 1, 2]))).toEqual('0x102');
  expect(() => format.hexUInt(3.50)).toThrow('cannot be converted to');
  expect(() => format.hexUInt(-0.5)).toThrow('cannot be converted to');
  expect(() => format.hexUInt(-1)).toThrow('not match bigUInt');
  expect(() => format.hexUInt(null)).toThrow('Cannot');
});

test('epochNumber', () => {
  expect(() => format.epochNumber(-1)).toThrow('match bigUInt');
  expect(format.epochNumber(0)).toEqual('0x0');
  expect(format.epochNumber(10)).toEqual('0xa');
  expect(format.epochNumber('latest_mined')).toEqual('latest_mined');
  expect(format.epochNumber('latest_state')).toEqual('latest_state');
  expect(() => format.epochNumber('LATEST_MINED')).toThrow('not equal latest_mined');
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
  expect(format.buffer('0x0a')).toEqual(Buffer.from([10]));

  expect(format.buffer(false)).toEqual(Buffer.from([0]));
  expect(format.buffer(true)).toEqual(Buffer.from([1]));
});

test('boolean', () => {
  expect(() => format.boolean(undefined)).toThrow('not match boolean');
  expect(() => format.boolean(1)).toThrow('not match boolean');

  expect(format.boolean(true)).toEqual(true);
  expect(format.boolean(false)).toEqual(false);
});
