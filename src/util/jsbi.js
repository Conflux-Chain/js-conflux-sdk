/**
 * support interface of [jsbi](https://github.com/GoogleChromeLabs/jsbi#readme)
 * - for node.js using native BigInt as JSBI.BigInt
 * - for browser using browserify to replace with jsbi
 */

/* eslint-disable no-bitwise */
module.exports = BigInt;
module.exports.BigInt = BigInt;

module.exports.toNumber = x => Number(x);

module.exports.unaryMinus = x => -x;
module.exports.bitwiseNot = x => ~x;

module.exports.exponentiate = (x, y) => x ** y;
module.exports.multiply = (x, y) => x * y;
module.exports.divide = (x, y) => x / y;
module.exports.remainder = (x, y) => x % y;
module.exports.add = (x, y) => x + y;
module.exports.subtract = (x, y) => x - y;
module.exports.leftShift = (x, y) => x << y;
module.exports.signedRightShift = (x, y) => x >> y;

module.exports.lessThan = (x, y) => x < y;
module.exports.lessThanOrEqual = (x, y) => x <= y;
module.exports.greaterThan = (x, y) => x > y;
module.exports.greaterThanOrEqual = (x, y) => x >= y;
module.exports.equal = (x, y) => x === y;
module.exports.notEqual = (x, y) => x !== y;

module.exports.bitwiseAnd = (x, y) => x & y;
module.exports.bitwiseXor = (x, y) => x ^ y;
module.exports.bitwiseOr = (x, y) => x | y;

module.exports.ADD = (x, y) => x + y;
module.exports.LT = (x, y) => x < y;
module.exports.LE = (x, y) => x <= y;
module.exports.GT = (x, y) => x > y;
module.exports.GE = (x, y) => x >= y;
module.exports.EQ = (x, y) => x === y;
module.exports.NE = (x, y) => x !== y;
