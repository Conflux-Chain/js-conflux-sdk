/**
 * support interface of [jsbi](https://github.com/GoogleChromeLabs/jsbi#readme)
 * - for node.js using native BigInt as JSBI.BigInt
 * - for browser using browserify to replace with jsbi
 */

/* eslint-disable no-bitwise */
const JSBI = BigInt;
JSBI.BigInt = BigInt;

JSBI.toNumber = x => Number(x);

JSBI.unaryMinus = x => -x;
JSBI.bitwiseNot = x => ~x;

JSBI.exponentiate = (x, y) => x ** y;
JSBI.multiply = (x, y) => x * y;
JSBI.divide = (x, y) => x / y;
JSBI.remainder = (x, y) => x % y;
JSBI.add = (x, y) => x + y;
JSBI.subtract = (x, y) => x - y;
JSBI.leftShift = (x, y) => x << y;
JSBI.signedRightShift = (x, y) => x >> y;

JSBI.lessThan = (x, y) => x < y;
JSBI.lessThanOrEqual = (x, y) => x <= y;
JSBI.greaterThan = (x, y) => x > y;
JSBI.greaterThanOrEqual = (x, y) => x >= y;
JSBI.equal = (x, y) => x === y;
JSBI.notEqual = (x, y) => x !== y;

JSBI.bitwiseAnd = (x, y) => x & y;
JSBI.bitwiseXor = (x, y) => x ^ y;
JSBI.bitwiseOr = (x, y) => x | y;

JSBI.ADD = (x, y) => x + y;
JSBI.LT = (x, y) => x < y;
JSBI.LE = (x, y) => x <= y;
JSBI.GT = (x, y) => x > y;
JSBI.GE = (x, y) => x >= y;
JSBI.EQ = (x, y) => x === y;
JSBI.NE = (x, y) => x !== y;

export default JSBI;
