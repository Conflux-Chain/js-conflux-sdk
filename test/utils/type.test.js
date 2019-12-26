const BigNumber = require('bignumber.js');
const {
  Hex,
  Drip,
  PrivateKey,
  Address,
  EpochNumber,
  BlockHash,
  TxHash,
} = require('../../src/utils/type');

const ADDRESS = '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b';
const KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393';

// ----------------------------------------------------------------------------
test('Hex(null)', () => {
  expect(() => Hex()).toThrow('do not match hex string');
  expect(() => Hex(undefined)).toThrow('do not match hex string');
  expect(Hex(null)).toEqual('0x');
});

test('Hex(string)', () => {
  expect(Hex('')).toEqual('0x');
  expect(Hex('0x')).toEqual('0x');

  expect(Hex('1234')).toEqual('0x1234');
  expect(Hex('0x1234')).toEqual('0x1234');

  expect(Hex('a')).toEqual('0x0a');
  expect(() => Hex('x')).toThrow('do not match hex string');
  expect(() => Hex(' a')).toThrow('do not match hex string');
  expect(() => Hex('a ')).toThrow('do not match hex string');

  expect(Hex('0xa')).toEqual('0x0a');
  expect(Hex('0x0A')).toEqual('0x0a');
});

test('Hex(Buffer)', () => {
  expect(Hex(Buffer.from([]))).toEqual('0x');
  expect(Hex(Buffer.from([1, 10, 255]))).toEqual('0x010aff');
});

test('Hex(Number)', () => {
  expect(() => Hex(-1)).toThrow('do not match hex string');
  expect(Hex(0)).toEqual('0x00');
  expect(Hex(1)).toEqual('0x01');
  expect(() => Hex(3.14)).toThrow('do not match hex string');
  expect(Hex(256)).toEqual('0x0100');
  expect(Hex(0x1fffffffffffff)).toEqual('0x1fffffffffffff');
});

test('Hex(BigNumber)', () => {
  expect(() => Hex(BigNumber(-1))).toThrow('do not match hex string');
  expect(Hex(BigNumber(0))).toEqual('0x00');
  expect(Hex(BigNumber(1))).toEqual('0x01');
  expect(() => Hex(BigNumber(3.14))).toThrow('do not match hex string');
  expect(Hex(BigNumber(256))).toEqual('0x0100');
  expect(Hex(BigNumber(0x1fffffffffffff))).toEqual('0x1fffffffffffff');

  expect(() => Hex(BigNumber(0.01).times(10))).toThrow('do not match hex string');
  expect(Hex(BigNumber(0.01).times(1e9).times(1e9))).toEqual('0x2386f26fc10000');
});

test('Hex(Date)', () => {
  expect(Hex(new Date('1970-01-01T00:00:00.000Z'))).toEqual('0x00');
  expect(Hex(new Date('1970-01-01T00:00:00.001Z'))).toEqual('0x01');
  expect(Hex(new Date('2000-01-01T00:00:00.000Z'))).toEqual('0xdc6acfac00');
  expect(Hex(new Date('2020-01-01T00:00:00.000Z'))).toEqual('0x016f5e66e800');
});

test('Hex.isHex', () => {
  expect(Hex.isHex()).toEqual(false);
  expect(Hex.isHex('0x')).toEqual(true);
  expect(Hex.isHex('01')).toEqual(false);
  expect(Hex.isHex('0x01')).toEqual(true);
  expect(Hex.isHex('0x1')).toEqual(false);

  expect(Hex.isHex(0x01)).toEqual(false);
});

test('Hex.toBuffer', () => {
  expect(Hex.toBuffer('0x')).toEqual(Buffer.from(''));
  expect(Hex.toBuffer('0x00')).toEqual(Buffer.from([0]));
  expect(Hex.toBuffer('0xff')).toEqual(Buffer.from('ff', 'hex'));
  expect(Hex.toBuffer('0x0102')).toEqual(Buffer.from([1, 2]));
  expect(() => Hex.toBuffer('ff')).toThrow('do not match hex string');
  expect(() => Hex.toBuffer(0xff)).toThrow('do not match hex string');
});

test('Hex.concat', () => {
  expect(Hex.concat()).toEqual('0x');
  expect(Hex.concat('0xabcd')).toEqual('0xabcd');
  expect(Hex.concat('0x01', '0x02')).toEqual('0x0102');
  expect(Hex.concat('0xabcd', '0x', '0xef')).toEqual('0xabcdef');

  expect(() => Hex.concat(0x01, 0x02)).toThrow('do not match hex string');
  expect(() => Hex.concat('0x1', '0x2')).toThrow('do not match hex string');
  expect(() => Hex.concat(['0x01', '0x02'])).toThrow('do not match hex string');
});

test('Hex.fromNumber', () => {
  expect(() => Hex.fromNumber(undefined)).toThrow('do not match hex string');

  expect(Hex.fromNumber(100)).toEqual('0x64');
  expect(Hex.fromNumber('100')).toEqual('0x64');
  expect(Hex.fromNumber('0100')).toEqual('0x64');
  expect(() => Hex.fromNumber(-100)).toThrow('do not match hex string');
  expect(() => Hex.fromNumber(true)).toThrow('do not match hex string');
  expect(() => Hex.fromNumber(null)).toThrow('do not match hex string');
});

test('Drip', () => {
  expect(() => Drip(undefined)).toThrow('do not match hex string');
  expect(() => Drip(null)).toThrow('do not match hex string');

  expect(Drip(0)).toEqual('0x00');
  expect(Drip(10)).toEqual('0x0a');
  expect(Drip('100')).toEqual('0x64');
  expect(Drip('0x100')).toEqual('0x0100');
  expect(Drip(BigNumber(0.01).times(1e9).times(1e9))).toEqual('0x2386f26fc10000');
});

test('Drip.fromGDrip', () => {
  expect(Drip.fromGDrip(0)).toEqual('0x00');
  expect(Drip.fromGDrip(0.01)).toEqual('0x989680');
  expect(Drip.fromGDrip(1)).toEqual('0x3b9aca00');
  expect(Drip.toGDrip('1000000000').toString()).toEqual('1');
  expect(Drip.toGDrip(Drip.fromCFX(1)).toString()).toEqual('1000000000');
});

test('Drip.fromCFX', () => {
  expect(Drip.fromCFX(0)).toEqual('0x00');
  expect(Drip.fromCFX(0.01)).toEqual('0x2386f26fc10000');
  expect(Drip.fromCFX(1)).toEqual('0x0de0b6b3a7640000');
  expect(Drip.toCFX('1000000000000000000').toString()).toEqual('1');
  expect(Drip.toCFX(Drip.fromGDrip(1e9)).toString()).toEqual('1');
});

test('PrivateKey', () => {
  expect(() => PrivateKey(undefined)).toThrow('do not match PrivateKey');

  expect(PrivateKey(KEY)).toEqual(KEY);
  expect(PrivateKey(KEY.toUpperCase())).toEqual(KEY);
  expect(PrivateKey(KEY.replace('0x', ''))).toEqual(KEY);
  expect(() => PrivateKey(ADDRESS)).toThrow('do not match PrivateKey');
});

test('Address', () => {
  expect(() => Address(undefined)).toThrow('do not match hex string');

  expect(Address(ADDRESS)).toEqual(ADDRESS);
  expect(Address(ADDRESS.toUpperCase())).toEqual(ADDRESS);
  expect(Address(ADDRESS.replace('0x', ''))).toEqual(ADDRESS);
  expect(() => Address(KEY)).toThrow('do not match Address');
});

test('EpochNumber', () => {
  expect(() => EpochNumber(undefined)).toThrow('do not match hex string');

  expect(EpochNumber(0)).toEqual('0x00');
  expect(EpochNumber('100')).toEqual('0x64');
  expect(EpochNumber(EpochNumber.LATEST_STATE)).toEqual(EpochNumber.LATEST_STATE);
  expect(EpochNumber(EpochNumber.LATEST_STATE.toUpperCase())).toEqual(EpochNumber.LATEST_STATE);
  expect(EpochNumber(EpochNumber.LATEST_MINED)).toEqual(EpochNumber.LATEST_MINED);
  expect(() => EpochNumber('xxxxxxx')).toThrow('do not match hex string');
});

test('BlockHash', () => {
  expect(() => BlockHash(undefined)).toThrow('do not match BlockHash');

  expect(BlockHash('0123456789012345678901234567890123456789012345678901234567890123'))
    .toEqual('0x0123456789012345678901234567890123456789012345678901234567890123');

  expect(BlockHash('0x0123456789012345678901234567890123456789012345678901234567890123'))
    .toEqual('0x0123456789012345678901234567890123456789012345678901234567890123');

  expect(() => BlockHash(ADDRESS)).toThrow('do not match BlockHash');
});

test('TxHash', () => {
  expect(() => TxHash(undefined)).toThrow('do not match TxHash');

  expect(TxHash('0123456789012345678901234567890123456789012345678901234567890123'))
    .toEqual('0x0123456789012345678901234567890123456789012345678901234567890123');

  expect(TxHash('0x0123456789012345678901234567890123456789012345678901234567890123'))
    .toEqual('0x0123456789012345678901234567890123456789012345678901234567890123');

  expect(() => TxHash(ADDRESS)).toThrow('do not match TxHash');
});
