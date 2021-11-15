/* eslint-disable no-bitwise,no-self-compare */

const JSBI = require('jsbi');
const NodeBI = require('../../src/util/jsbi');

JSBI.prototype.toJSON = function () {
  return this.toString();
};

NodeBI.prototype.toJSON = function () {
  return this.toString();
};

const jsbi = JSBI.BigInt(10);
const bi = NodeBI.BigInt(10);

test('constructor', () => {
  expect(jsbi).toBeInstanceOf(JSBI);
  expect(typeof bi).toEqual('bigint');

  expect(JSBI.toNumber(jsbi)).toEqual(10);
  expect(NodeBI.toNumber(bi)).toEqual(10);

  expect(JSON.stringify(jsbi)).toEqual('"10"');
  expect(JSON.stringify(bi)).toEqual('"10"');
});

test('toString', () => {
  expect(jsbi.toString()).toEqual('10');
  expect(bi.toString()).toEqual('10');

  expect(jsbi.toString(2)).toEqual('1010');
  expect(bi.toString(2)).toEqual('1010');

  expect(jsbi.toString(8)).toEqual('12');
  expect(bi.toString(8)).toEqual('12');

  expect(jsbi.toString(10)).toEqual('10');
  expect(bi.toString(10)).toEqual('10');

  expect(jsbi.toString(16)).toEqual('a');
  expect(bi.toString(16)).toEqual('a');
});

test('operator', () => {
  expect(JSBI.unaryMinus(jsbi)).toEqual(JSBI.BigInt(-jsbi));
  expect(NodeBI.unaryMinus(bi)).toEqual(BigInt(-bi));

  expect(JSBI.bitwiseNot(jsbi)).toEqual(JSBI.BigInt(~jsbi));
  expect(NodeBI.bitwiseNot(bi)).toEqual(BigInt(~bi));

  expect(JSBI.asIntN(4, JSBI.BigInt(0xff))).toEqual(JSBI.BigInt(-1));
  expect(NodeBI.asIntN(4, NodeBI.BigInt(0xff))).toEqual(BigInt(-1));

  expect(JSBI.asUintN(4, JSBI.BigInt(0xff))).toEqual(JSBI.BigInt(15));
  expect(NodeBI.asUintN(4, NodeBI.BigInt(0xff))).toEqual(BigInt(15));

  expect(JSBI.exponentiate(jsbi, JSBI.BigInt(2))).toEqual(JSBI.BigInt(10 ** 2));
  expect(NodeBI.exponentiate(bi, NodeBI.BigInt(2))).toEqual(BigInt(10 ** 2));
  expect(() => JSBI.exponentiate(jsbi, 2)).toThrow('_.__unsignedDigit is not a function');
  expect(() => NodeBI.exponentiate(bi, 2)).toThrow('Cannot mix BigInt and other types, use explicit conversions');

  expect(JSBI.multiply(jsbi, JSBI.BigInt(2))).toEqual(JSBI.BigInt(10 * 2));
  expect(NodeBI.multiply(bi, NodeBI.BigInt(2))).toEqual(BigInt(10 * 2));

  expect(JSBI.divide(jsbi, JSBI.BigInt(3))).toEqual(JSBI.BigInt(Math.floor(10 / 3)));
  expect(NodeBI.divide(bi, NodeBI.BigInt(3))).toEqual(BigInt(Math.floor(10 / 3)));
  expect(JSBI.divide(jsbi, JSBI.BigInt(11))).toEqual(JSBI.BigInt(Math.floor(10 / 11)));
  expect(NodeBI.divide(bi, NodeBI.BigInt(11))).toEqual(BigInt(Math.floor(10 / 11)));

  expect(JSBI.remainder(jsbi, JSBI.BigInt(3))).toEqual(JSBI.BigInt(10 % 3));
  expect(NodeBI.remainder(bi, NodeBI.BigInt(3))).toEqual(BigInt(10 % 3));

  expect(JSBI.add(jsbi, JSBI.BigInt(1))).toEqual(JSBI.BigInt(11));
  expect(NodeBI.add(bi, NodeBI.BigInt(1))).toEqual(BigInt(11));
  expect(JSBI.ADD(jsbi, JSBI.BigInt(1))).toEqual(JSBI.BigInt(11));
  expect(NodeBI.ADD(bi, NodeBI.BigInt(1))).toEqual(BigInt(11));

  expect(JSBI.subtract(jsbi, JSBI.BigInt(20))).toEqual(JSBI.BigInt(-10));
  expect(NodeBI.subtract(bi, NodeBI.BigInt(20))).toEqual(BigInt(-10));

  expect(JSBI.leftShift(jsbi, JSBI.BigInt(2))).toEqual(JSBI.BigInt(10 << 2));
  expect(NodeBI.leftShift(bi, NodeBI.BigInt(2))).toEqual(BigInt(10 << 2));

  expect(JSBI.signedRightShift(jsbi, JSBI.BigInt(2))).toEqual(JSBI.BigInt(10 >> 2));
  expect(NodeBI.signedRightShift(bi, NodeBI.BigInt(2))).toEqual(BigInt(10 >> 2));

  expect(JSBI.lessThan(jsbi, JSBI.BigInt(11))).toEqual(10 < 11);
  expect(NodeBI.lessThan(bi, NodeBI.BigInt(11))).toEqual(10 < 11);
  expect(JSBI.LT(jsbi, JSBI.BigInt(11))).toEqual(10 < 11);
  expect(NodeBI.LT(bi, NodeBI.BigInt(11))).toEqual(10 < 11);

  expect(JSBI.lessThanOrEqual(jsbi, JSBI.BigInt(10))).toEqual(10 <= 10);
  expect(NodeBI.lessThanOrEqual(bi, NodeBI.BigInt(10))).toEqual(10 <= 10);
  expect(JSBI.LE(jsbi, JSBI.BigInt(10))).toEqual(10 <= 10);
  expect(NodeBI.LE(bi, NodeBI.BigInt(10))).toEqual(10 <= 10);

  expect(JSBI.greaterThan(jsbi, JSBI.BigInt(11))).toEqual(10 > 11);
  expect(NodeBI.greaterThan(bi, NodeBI.BigInt(11))).toEqual(10 > 11);
  expect(JSBI.GT(jsbi, JSBI.BigInt(11))).toEqual(10 > 11);
  expect(NodeBI.GT(bi, NodeBI.BigInt(11))).toEqual(10 > 11);

  expect(JSBI.greaterThanOrEqual(jsbi, JSBI.BigInt(10))).toEqual(10 >= 10);
  expect(NodeBI.greaterThanOrEqual(bi, NodeBI.BigInt(10))).toEqual(10 >= 10);
  expect(JSBI.GE(jsbi, JSBI.BigInt(10))).toEqual(10 >= 10);
  expect(NodeBI.GE(bi, NodeBI.BigInt(10))).toEqual(10 >= 10);

  expect(JSBI.equal(jsbi, JSBI.BigInt(10))).toEqual(10 === 10);
  expect(NodeBI.equal(bi, NodeBI.BigInt(10))).toEqual(10 === 10);
  expect(JSBI.EQ(jsbi, JSBI.BigInt(10))).toEqual(10 === 10);
  expect(NodeBI.EQ(bi, NodeBI.BigInt(10))).toEqual(10 === 10);

  expect(JSBI.notEqual(jsbi, JSBI.BigInt(10))).toEqual(10 !== 10);
  expect(NodeBI.notEqual(bi, NodeBI.BigInt(10))).toEqual(10 !== 10);
  expect(JSBI.NE(jsbi, JSBI.BigInt(10))).toEqual(10 !== 10);
  expect(NodeBI.NE(bi, NodeBI.BigInt(10))).toEqual(10 !== 10);

  expect(JSBI.bitwiseAnd(jsbi, JSBI.BigInt(11))).toEqual(JSBI.BigInt(10 & 11));
  expect(NodeBI.bitwiseAnd(bi, NodeBI.BigInt(11))).toEqual(BigInt(10 & 11));

  expect(JSBI.bitwiseXor(jsbi, JSBI.BigInt(11))).toEqual(JSBI.BigInt(10 ^ 11));
  expect(NodeBI.bitwiseXor(bi, NodeBI.BigInt(11))).toEqual(BigInt(10 ^ 11));

  expect(JSBI.bitwiseOr(jsbi, JSBI.BigInt(11))).toEqual(JSBI.BigInt(10 | 11));
  expect(NodeBI.bitwiseOr(bi, NodeBI.BigInt(11))).toEqual(BigInt(10 | 11));
});
