const JSBI = require('jsbi');
const Big = require('big.js');
const lodash = require('lodash');
const Parser = require('../lib/parser');

const MAX_UINT_256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt
JSBI.prototype.toJSON = function () {
  return this.toString();
};

// ----------------------------------------------------------------------------
function toHex(value) {
  let hex;

  if (lodash.isString(value)) {
    hex = value.toLowerCase(); // XXX: lower case for support checksum address
  } else if (Number.isInteger(value) || (value instanceof JSBI)) {
    hex = `0x${value.toString(16)}`;
  } else if (Buffer.isBuffer(value)) {
    hex = `0x${value.toString('hex')}`;
  } else if (lodash.isBoolean(value)) {
    hex = value ? '0x01' : '0x00';
  } else if (value === null) {
    hex = '0x';
  } else {
    hex = `${value}`;
  }

  if (!/^0x[0-9a-f]*$/.test(hex)) {
    throw new Error(`${value} not match hex`);
  }
  return hex.length % 2 ? `0x0${hex.slice(2)}` : hex;
}

function toNumber(value) {
  if (value === null) {
    throw new Error(`${value} not match number`);
  } else if (Buffer.isBuffer(value)) {
    value = `0x${value.toString('hex')}`;
  }
  return Number(value);
}

function toBigInt(value) {
  if (Buffer.isBuffer(value)) {
    value = `0x${value.toString('hex')}`;
  } else if (lodash.isString(value)) {
    value = value.replace(/^(-?\d+)(.0+)?$/, '$1');
  }
  return JSBI.BigInt(value);
}

// ----------------------------------------------------------------------------
const format = {};

/**
 * @param arg {any}
 * @return {any} arg
 *
 * @example
 * > format.any(1)
 1
 */
format.any = Parser(v => v);

/**
 * When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
 *
 * @param arg {number|JSBI|string|Buffer|boolean|null}
 * @return {string} Hex string
 *
 * @example
 * > format.hex(null)
 '0x'
 * > format.hex(1)
 "0x01"
 * > format.hex(256)
 "0x0100"
 * > format.hex(true)
 "0x01"
 * > format.hex(Buffer.from([1,10,255]))
 "0x010aff"
 * > format.hex("0x0a")
 "0x0a"
 */
format.hex = Parser(toHex);
format.hex64 = format.hex.validate(v => v.length === 2 + 64, 'hex64');

/**
 * @param arg {number|JSBI|string|boolean}
 * @return {Number}
 *
 * @example
 * > format.uInt(-3.14)
 Error("cannot be converted to a JSBI")
 * > format.uInt(null)
 Error("Cannot convert null to a JSBI")
 * > format.uInt('0')
 0
 * > format.uInt(1)
 1
 * > format.uInt(JSBI(100))
 100
 * > format.uInt('0x10')
 16
 * > format.uInt('')
 0
 * > format.uInt(true)
 1
 * > format.uInt(false)
 0
 * > format.uInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
 */
format.uInt = Parser(toNumber).validate(v => Number.isSafeInteger(v) && v >= 0, 'uint');

/**
 * @param arg {number|JSBI|string|boolean}
 * @return {JSBI}
 *
 * @example
 * > format.bigInt(-3.14)
 Error("not match bigInt")
 * > format.bigInt('0.0')
 JSBI.BigInt(0)
 * > format.bigInt('-1')
 JSBI.BigInt(-1)
 * > format.bigInt(1)
 JSBI.BigInt(1)
 * > format.bigInt(JSBI(100))
 JSBI.BigInt(100)
 * > format.bigInt('0x10')
 JSBI.BigInt(16)
 * > format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
 */
format.bigInt = Parser(toBigInt);

/**
 * @param arg {number|JSBI|string|boolean}
 * @return {JSBI}
 *
 * @example
 * > format.bigUInt('0.0')
 JSBI.BigInt(0)
 * > format.bigUInt('-1')
 Error("not match bigUInt")
 */
format.bigUInt = format.bigInt.validate(v => v >= 0, 'bigUInt');

/**
 * When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")
 *
 * @param arg {number|string|boolean}
 * @return {string} Hex string
 *
 * @example
 * > format.hexUInt(100)
 "0x64"
 * > format.hexUInt(10)
 "0xa"
 * > format.hexUInt(3.50)
 "0x4"
 * > format.hexUInt(3.49)
 "0x3"
 * > format.hexUInt(-1))
 Error("not match uintHex")
 */
format.hexUInt = format.bigUInt
  .parse(v => `0x${v.toString(16)}`)
  .validate(v => /^0x[0-9a-f]+$/.test(v), 'hexUInt');

/**
 * @param hex {string}
 * @return {number}
 *
 * @example
 * > format.riskNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
 * > format.riskNumber('0xe666666666666666666666666666666666666666666666666666666666666665')
 0.9
 */
format.riskNumber = format.bigUInt.parse(v => Number(Big(v).div(MAX_UINT_256))).or(null);

/**
 * @param arg {number|string} - number or string in ['latest_state', 'latest_mined']
 * @return {string}
 *
 * @example
 * > format.epochNumber(10)
 "0xa"
 * > format.epochNumber('latest_state')
 "latest_state"
 * > format.epochNumber('latest_mined')
 "latest_state"
 */
format.epochNumber = format.hexUInt
  .or('earliest')
  .or('latest_checkpoint')
  .or('latest_confirmed')
  .or('latest_state')
  .or('latest_mined');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
 * > format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
 */
format.address = format.hex.validate(v => v.length === 2 + 40, 'address'); // alias

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
 */
format.publicKey = format.hex.validate(v => v.length === 2 + 128, 'publicKey');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.privateKey = format.hex64; // alias

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 */
format.signature = format.hex.validate(v => v.length === 2 + 130, 'signature');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.blockHash = format.hex64; // alias

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.txHash = format.hex64; // alias

/**
 * @param arg {number|JSBI|string|Buffer|boolean|null}
 * @return {Buffer}
 *
 * @example
 * > format.buffer(Buffer.from([0, 1]))
 <Buffer 00 01>
 * > format.buffer(null)
 <Buffer >
 * > format.buffer(1024)
 <Buffer 04 00>
 * > format.buffer('0x0a')
 <Buffer 0a>
 * > format.buffer(true)
 <Buffer 01>
 * > format.buffer(3.14)
 Error("not match hex")
 */
format.buffer = Parser(v => (Buffer.isBuffer(v) ? v : Buffer.from(format.hex(v).substring(2), 'hex')));

/**
 * @param arg {string|Buffer|array}
 * @return {Buffer}
 *
 * @example
 * > format.bytes('abcd')
 <Buffer 61 62 63 64>
 * > format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
 * > format.bytes([0, 1])
 <Buffer 00 01>
 */
format.bytes = Parser(v => (Buffer.isBuffer(v) ? v : Buffer.from(v)));

/**
 * @param arg {boolean}
 * @return {boolean}
 *
 * @example
 * > format.boolean(true)
 true
 * > format.boolean(false)
 false
 */
format.boolean = format.any.validate(lodash.isBoolean, 'boolean');

// ----------------------------- parse rpc returned ---------------------------
format.status = Parser({
  chainId: format.uInt,
  epochNumber: format.uInt,
  blockNumber: format.uInt,
  pendingTxNumber: format.uInt,
});

format.transaction = Parser({
  nonce: format.uInt,
  value: format.bigUInt,
  gasPrice: format.bigUInt,
  gas: format.bigUInt,
  v: format.uInt,
  transactionIndex: format.uInt.or(null),
  status: format.uInt.or(null), // XXX: might be remove in rpc returned
  storageLimit: format.bigUInt,
  chainId: format.uInt,
  epochHeight: format.uInt,
});

format.estimate = Parser({
  gasUsed: format.bigUInt,
  storageCollateralized: format.bigUInt,
});

format.block = Parser({
  epochNumber: format.uInt.or(null), // FIXME null for getBlockByEpochNumber(0)
  blame: format.uInt,
  height: format.uInt,
  size: format.uInt,
  timestamp: format.uInt,
  gasLimit: format.bigUInt,
  difficulty: format.bigUInt,
  transactions: [(format.transaction).or(format.txHash)],
});

format.receipt = Parser({
  index: format.uInt,
  epochNumber: format.uInt,
  outcomeStatus: format.uInt.or(null),
  gasUsed: format.bigUInt,
  gasFee: format.bigUInt,
});

format.logs = Parser([
  {
    epochNumber: format.uInt,
    logIndex: format.uInt,
    transactionIndex: format.uInt,
    transactionLogIndex: format.uInt,
  },
]);

// -------------------------- format method arguments -------------------------
format.getLogs = Parser({
  limit: format.hexUInt.or(undefined),
  fromEpoch: format.epochNumber.or(undefined),
  toEpoch: format.epochNumber.or(undefined),
  blockHashes: format.blockHash.or([format.blockHash]).or(undefined),
  address: format.address.or([format.address]).or(undefined),
  topics: Parser([format.hex64.or([format.hex64]).or(null)]).or(undefined),
});

// FIXME: accept null ?
format.signTx = Parser({
  nonce: format.hexUInt.parse(format.buffer),
  gasPrice: format.hexUInt.parse(format.buffer),
  gas: format.hexUInt.parse(format.buffer),
  to: Parser(format.address.or(null).default(null)).parse(format.buffer),
  value: format.hexUInt.default(0).parse(format.buffer),
  storageLimit: format.hexUInt.parse(format.buffer),
  epochHeight: format.uInt.parse(format.buffer),
  chainId: format.uInt.default(0).parse(format.buffer),
  data: format.hex.default('0x').parse(format.buffer),
  r: format.hexUInt.parse(format.buffer).or(undefined),
  s: format.hexUInt.parse(format.buffer).or(undefined),
  v: format.uInt.parse(format.buffer).or(undefined),
});

format.sendTx = Parser({
  from: format.address,
  nonce: format.hexUInt,
  gasPrice: format.hexUInt,
  gas: format.hexUInt,
  to: format.address.or(null).or(undefined),
  value: format.hexUInt.or(undefined),
  storageLimit: format.hexUInt,
  epochHeight: format.hexUInt,
  chainId: format.hexUInt,
  data: format.hex.or(undefined),
});

format.callTx = Parser({
  from: format.address.or(undefined),
  nonce: format.hexUInt.or(undefined),
  gasPrice: format.hexUInt.or(undefined),
  gas: format.hexUInt.or(undefined),
  to: format.address.or(null),
  value: format.hexUInt.or(undefined),
  storageLimit: format.hexUInt.or(undefined),
  epochHeight: format.uInt.or(undefined),
  chainId: format.uInt.or(undefined),
  data: format.hex.or(undefined),
});

format.estimateTx = Parser({
  from: format.address.or(undefined),
  nonce: format.hexUInt.or(undefined),
  gasPrice: format.hexUInt.or(undefined),
  gas: format.hexUInt.or(undefined),
  to: format.address.or(null).or(undefined),
  value: format.hexUInt.or(undefined),
  storageLimit: format.hexUInt.or(undefined),
  epochHeight: format.uInt.or(undefined),
  chainId: format.uInt.or(undefined),
  data: format.hex.or(undefined),
});

module.exports = format;
