const lodash = require('lodash');
const BigNumber = require('bignumber.js');
const Parser = require('../lib/parser');

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 20, // (1 CFX = 1e18 Drip, 20>18)
  EXPONENTIAL_AT: 1e9,
});

// ----------------------------------------------------------------------------
function toHex(value) {
  let hex;

  if (lodash.isString(value)) {
    hex = value.toLowerCase(); // XXX: for checksum address
  } else if (value === null) {
    hex = '0x';
  } else if (Number.isInteger(value) || BigNumber.isBigNumber(value)) {
    const string = value.toString(16);
    hex = string.length % 2 ? `0x0${string}` : `0x${string}`;
  } else if (Buffer.isBuffer(value)) {
    hex = `0x${value.toString('hex')}`;
  } else if (lodash.isBoolean(value)) {
    hex = value ? '0x01' : '0x00';
  } else {
    hex = `${value}`;
  }

  if (!/^0x([0-9a-f][0-9a-f])*$/.test(hex)) {
    throw new Error(`${value} not match hex`);
  }
  return hex;
}

function toNumber(value) {
  if (lodash.isNumber(value)) {
    return value;
  }

  if (BigNumber.isBigNumber(value)) {
    return value.toNumber();
  }

  if (lodash.isString(value)) {
    return BigNumber(value).toNumber();
  }

  if (lodash.isBoolean(value)) {
    return Number(value ? 1 : 0);
  }

  return NaN;
}

function toBigNumber(value) {
  if (BigNumber.isBigNumber(value)) {
    return value;
  }

  if (lodash.isNumber(value)) {
    return BigNumber(value);
  }

  if (lodash.isString(value)) {
    return BigNumber(value);
  }

  if (lodash.isBoolean(value)) {
    return BigNumber(value ? 1 : 0);
  }

  return BigNumber(NaN);
}

// ----------------------------------------------------------------------------
const format = {};

/**
 * When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
 *
 * @param arg {number|BigNumber|string|Buffer|boolean|null}
 * @return {string} Hex string
 *
 * @example
 * > format.hex(null)
 '0x'
 * > format.hex(1)
 "0x01"
 * > format.hex(BigNumber(256))
 "0x0100"
 * > format.hex(true)
 "0x01"
 * > format.hex(Buffer.from([1,10,255]))
 "0x010aff"
 * > format.hex("0x0a")
 "0x0a"
 */
format.hex = Parser(toHex);
format.hex40 = format.hex.validate(v => v.length === 2 + 40, 'hex40');
format.hex64 = format.hex.validate(v => v.length === 2 + 64, 'hex64');

/**
 * @param arg {number|string} - number or string in ['latest_state', 'latest_mined']
 * @return {string}
 *
 * @example
 * > format.epochNumber(10)
 "0x0a"
 * > format.epochNumber('latest_state')
 "latest_state"
 * > format.epochNumber('latest_mined')
 "latest_state"
 */
format.epochNumber = format.hex.or('latest_state').or('latest_mined');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
 * > format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match hex40")
 */
format.address = format.hex40; // alias

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
 * @param arg {number|BigNumber|string|boolean}
 * @return {Number}
 *
 * @example
 * > format.number(-3.14)
 -3.14
 * > format.number('-3.14')
 -3.14
 * > format.number('0x10')
 16
 * format.number(true)
 1
 */
format.number = Parser(toNumber).validate(v => Number.isFinite(v), 'number');

/**
 * @param arg {number|BigNumber|string|boolean}
 * @return {Number}
 *
 * @example
 * > format.uint(-3.14)
 Error("not match uint")
 * > format.uint(10)
 10
 * > format.uint(BigNumber(100))
 100
 * > format.uint('0x10')
 16
 * > format.uint(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
 */
format.uint = format.number.validate(v => v >= 0 && Number.isSafeInteger(v), 'uint');

/**
 * @param arg {number|BigNumber|string|boolean}
 * @return {BigNumber}
 *
 * @example
 * > format.bigNumber(-3.14)
 "-3.14"
 * > format.bigNumber('-3.14')
 "-3.14"
 * > format.bigNumber('0x10')
 "16"
 * format.bigNumber(true)
 "1"
 */
format.bigNumber = Parser(toBigNumber).validate(v => v.isFinite(), 'bigNumber');

/**
 * When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")
 *
 * @param arg {number|BigNumber|string|boolean}
 * @return {string} Hex string
 *
 * @example
 * > format.hexNumber(100)
 "0x64"
 * > format.hexNumber(BigNumber(10))
 "0xa"
 * > format.hexNumber(3.50)
 "0x4"
 * > format.hexNumber(3.49)
 "0x3"
 * > format.hexNumber(-1))
 Error("not match hexNumber")
 */
format.hexNumber = format.bigNumber
  .parse(v => `0x${v.integerValue().toString(16)}`)
  .validate(v => /^0x[0-9a-f]+$/.test(v), 'hexNumber');

/**
 * @param arg {number|BigNumber|string|Buffer|boolean|null}
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
 * @param arg {boolean}
 * @return {boolean}
 *
 * @example
 * > format.boolean(true)
 true
 * > format.boolean(false)
 false
 */
format.boolean = Parser(v => v).validate(lodash.isBoolean, 'boolean');

// ----------------------------- parse rpc returned ---------------------------
format.transaction = Parser({
  nonce: format.uint,
  value: format.bigNumber,
  gasPrice: format.bigNumber,
  gas: format.bigNumber,
  v: format.uint,
  transactionIndex: format.uint.or(null),
  status: format.uint.or(null), // XXX: might be remove in rpc returned
});

format.block = Parser({
  epochNumber: format.uint.or(null), // FIXME null for getBlockByEpochNumber(0)
  height: format.uint,
  size: format.uint,
  timestamp: format.uint,
  gasLimit: format.bigNumber,
  difficulty: format.bigNumber,
  transactions: [(format.transaction).or(format.txHash)],
  stable: format.uint.or(null),
});

format.receipt = Parser({
  index: format.uint, // XXX: number already in rpc return
  epochNumber: format.uint, // XXX: number already in rpc return
  outcomeStatus: format.uint, // XXX: number already in rpc return
  gasUsed: format.bigNumber,
  logs: [
    {
      // FIXME: getTransactionReceipt returned log.data is array of number
      data: data => (Array.isArray(data) ? format.hex(Buffer.from(data)) : data),
    },
  ],
});

format.logs = Parser([
  {
    epochNumber: format.uint,
    logIndex: format.uint,
    transactionIndex: format.uint,
    transactionLogIndex: format.uint,
  },
]);

// -------------------------- format method arguments -------------------------
format.getLogs = Parser({
  limit: format.hexNumber.or(undefined),
  fromEpoch: format.epochNumber.or(undefined),
  toEpoch: format.epochNumber.or(undefined),
  blockHashes: format.blockHash.or([format.blockHash]).or(undefined),
  address: format.address.or([format.address]).or(undefined),
  topics: Parser([format.hex64.or([format.hex64]).or(null)]).or(undefined),
});

// FIXME: accept null ?
format.signTx = Parser({
  nonce: format.uint,
  gasPrice: format.bigNumber,
  gas: format.bigNumber,
  to: format.address.or(null).default(null),
  value: format.bigNumber.default(0),
  data: format.hex.default('0x'),
  r: format.hex64.or(undefined),
  s: format.hex64.or(undefined),
  v: format.uint.or(undefined),
});

format.sendTx = Parser({
  from: format.address,
  nonce: format.hexNumber,
  gasPrice: format.hexNumber,
  gas: format.hexNumber,
  to: format.address.or(undefined),
  value: format.hexNumber.or(undefined),
  data: format.hex.or(undefined),
});

format.callTx = Parser({
  from: format.address.or(undefined),
  nonce: format.hexNumber.or(undefined),
  gasPrice: format.hexNumber.or(undefined),
  gas: format.hexNumber.or(undefined),
  to: format.address,
  value: format.hexNumber.or(undefined),
  data: format.hex.or(undefined),
});

format.estimateTx = Parser({
  from: format.address.or(undefined),
  nonce: format.hexNumber.or(undefined),
  gasPrice: format.hexNumber.or(undefined),
  gas: format.hexNumber.or(undefined),
  to: format.address.or(undefined),
  value: format.hexNumber.or(undefined),
  data: format.hex.or(undefined),
});

module.exports = format;
