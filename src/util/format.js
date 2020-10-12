const JSBI = require('jsbi');
const Big = require('big.js');
const lodash = require('lodash');
const parser = require('./parser');
const { EPOCH_NUMBER, MAX_UINT } = require('../CONST');

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
  if (lodash.isString(value)) {
    value = value.replace(/^(-?\d+)(.0+)?$/, '$1'); // replace "number.000" to "number"
  } else if (lodash.isBoolean(value)) {
    throw new Error(`${value} not match BigInt`);
  } else if (Buffer.isBuffer(value)) {
    throw new Error(`${value} not match BigInt`);
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
format.any = parser(v => v);

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
format.hex = parser(toHex);
format.hex64 = format.hex.$validate(v => v.length === 2 + 64, 'hex64');

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
format.uInt = parser(toNumber).$validate(v => Number.isSafeInteger(v) && v >= 0, 'uint');

/**
 * @param arg {number|string|JSBI}
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
 * > format.bigInt(JSBI.BigInt(100))
 JSBI.BigInt(100)
 * > format.bigInt('0x10')
 JSBI.BigInt(16)
 * > format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
 */
format.bigInt = parser(toBigInt);

/**
 * @param arg {number|string|JSBI}
 * @return {JSBI}
 *
 * @example
 * > format.bigUInt('0.0')
 JSBI.BigInt(0)
 * > format.bigUInt('-1')
 Error("not match bigUInt")
 */
format.bigUInt = format.bigInt.$validate(v => v >= 0, 'bigUInt');

/**
 * @param arg {number|string|JSBI}
 * @return {string} decimal string
 *
 * @example
 * > format.bigUIntDec(100)
 "100"
 * > format.bigUIntDec('0x0a')
 "10"
 * > format.bigUIntDec(-1)
 Error("not match bigUInt")
 */
format.bigUIntDec = format.bigUInt.$after(v => v.toString(10));

/**
 * When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")
 *
 * @param arg {number|string|JSBI}
 * @return {string} Hex string
 *
 * @example
 * > format.bigUIntHex(100)
 "0x64"
 * > format.bigUIntHex('0x0a')
 "0xa"
 * > format.bigUIntHex(-1))
 Error("not match uintHex")
 */
format.bigUIntHex = format.bigUInt.$after(v => `0x${v.toString(16)}`);

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
format.riskNumber = format.bigUInt.$after(v => Number(Big(v).div(MAX_UINT)));

/**
 * @param arg {number|string} - number or string
 * @return {string}
 *
 * @example
 * > format.epochNumber(10)
 "0xa"
 * > format.epochNumber(EPOCH_NUMBER.LATEST_STATE)
 "latest_state"
 * > format.epochNumber('latest_mined')
 "latest_mined"
 */
format.epochNumber = format.bigUIntHex
  .$or(EPOCH_NUMBER.LATEST_MINED)
  .$or(EPOCH_NUMBER.LATEST_STATE)
  .$or(EPOCH_NUMBER.LATEST_CONFIRMED)
  .$or(EPOCH_NUMBER.LATEST_CHECKPOINT)
  .$or(EPOCH_NUMBER.EARLIEST);

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
format.address = format.hex.$validate(v => v.length === 2 + 40, 'address'); // alias

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
format.publicKey = format.hex.$validate(v => v.length === 2 + 128, 'publicKey');

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
format.signature = format.hex.$validate(v => v.length === 2 + 130, 'signature');

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
format.transactionHash = format.hex64; // alias

/**
 * @param arg {number|string|JSBI|Buffer|boolean|null}
 * @return {Buffer}
 *
 * @example
 * > format.hexBuffer(Buffer.from([0, 1]))
 <Buffer 00 01>
 * > format.hexBuffer(null)
 <Buffer >
 * > format.hexBuffer(1024)
 <Buffer 04 00>
 * > format.hexBuffer('0x0a')
 <Buffer 0a>
 * > format.hexBuffer(true)
 <Buffer 01>
 * > format.hexBuffer(3.14)
 Error("not match hex")
 */
format.hexBuffer = format.hex.$after(v => Buffer.from(v.substr(2), 'hex'));

/**
 * @param arg {string|Buffer|array}
 * @return {Buffer}
 *
 * @example
 * > format.bytes('abcd')
 <Buffer 61 62 63 64>
 * > format.bytes([0, 1])
 <Buffer 00 01>
 * > format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
 */
format.bytes = parser(v => (Buffer.isBuffer(v) ? v : Buffer.from(v)));

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
format.boolean = format.any.$validate(lodash.isBoolean, 'boolean');

// -------------------------- format method arguments -------------------------
format.getLogs = parser({
  limit: format.bigUIntHex.$or(undefined),
  fromEpoch: format.epochNumber.$or(undefined),
  toEpoch: format.epochNumber.$or(undefined),
  blockHashes: format.blockHash.$or([format.blockHash]).$or(undefined),
  address: format.address.$or([format.address]).$or(undefined),
  topics: parser([format.hex64.$or([format.hex64]).$or(null)]).$or(undefined),
}, true);

format.signTx = parser({
  nonce: format.bigUIntHex.$after(format.hexBuffer),
  gasPrice: format.bigUIntHex.$after(format.hexBuffer),
  gas: format.bigUIntHex.$after(format.hexBuffer),
  to: parser(format.address.$or(null).$default(null)).$after(format.hexBuffer),
  value: format.bigUIntHex.$default(0).$after(format.hexBuffer),
  storageLimit: format.bigUIntHex.$after(format.hexBuffer),
  epochHeight: format.uInt.$after(format.hexBuffer),
  chainId: format.uInt.$default(0).$after(format.hexBuffer),
  data: format.hex.$default('0x').$after(format.hexBuffer),
  r: (format.bigUIntHex.$after(format.hexBuffer)).$or(undefined),
  s: (format.bigUIntHex.$after(format.hexBuffer)).$or(undefined),
  v: (format.uInt.$after(format.hexBuffer)).$or(undefined),
}, true);

format.sendTx = parser({
  from: format.address,
  nonce: format.bigUIntHex.$or(undefined),
  gasPrice: format.bigUIntHex,
  gas: format.bigUIntHex,
  to: format.address.$or(null).$or(undefined),
  value: format.bigUIntHex.$or(undefined),
  storageLimit: format.bigUIntHex,
  epochHeight: format.bigUIntHex.$or(undefined),
  chainId: format.bigUIntHex.$or(undefined),
  data: format.hex.$or(undefined),
}, true);

format.callTx = parser({
  from: format.address.$or(undefined),
  nonce: format.bigUIntHex.$or(undefined),
  gasPrice: format.bigUIntHex.$or(undefined),
  gas: format.bigUIntHex.$or(undefined),
  to: format.address.$or(null),
  value: format.bigUIntHex.$or(undefined),
  storageLimit: format.bigUIntHex.$or(undefined),
  epochHeight: format.uInt.$or(undefined),
  chainId: format.uInt.$or(undefined),
  data: format.hex.$or(undefined),
}, true);

format.estimateTx = parser({
  from: format.address.$or(undefined),
  nonce: format.bigUIntHex.$or(undefined),
  gasPrice: format.bigUIntHex.$or(undefined),
  gas: format.bigUIntHex.$or(undefined),
  to: format.address.$or(null).$or(undefined),
  value: format.bigUIntHex.$or(undefined),
  storageLimit: format.bigUIntHex.$or(undefined),
  epochHeight: format.uInt.$or(undefined),
  chainId: format.uInt.$or(undefined),
  data: format.hex.$or(undefined),
}, true);

// ----------------------------- parse rpc returned ---------------------------
format.status = parser({
  chainId: format.uInt,
  epochNumber: format.uInt,
  blockNumber: format.uInt,
  pendingTxNumber: format.uInt,
});

format.account = parser({
  accumulatedInterestReturn: format.bigUIntDec,
  balance: format.bigUIntDec,
  collateralForStorage: format.bigUIntDec,
  nonce: format.bigUIntDec,
  stakingBalance: format.bigUIntDec,
});

format.estimate = parser({
  gasUsed: format.bigUIntDec,
  storageCollateralized: format.bigUIntDec,
});

format.transaction = parser({
  nonce: format.bigUIntDec,
  gasPrice: format.bigUIntDec,
  gas: format.bigUIntDec,
  value: format.bigUIntDec,
  storageLimit: format.bigUIntDec,
  epochHeight: format.uInt,
  chainId: format.uInt,
  v: format.uInt,
  status: format.uInt.$or(null),
  transactionIndex: format.uInt.$or(null),
});

format.block = parser({
  epochNumber: format.uInt,
  blame: format.uInt,
  height: format.uInt,
  size: format.uInt,
  timestamp: format.uInt,
  gasLimit: format.bigUIntDec,
  gasUsed: format.bigUIntDec.$or(undefined), // XXX: undefined before main net upgrade
  difficulty: format.bigUIntDec,
  powQuality: format.bigUIntDec,
  transactions: [(format.transaction).$or(format.transactionHash)],
});

format.receipt = parser({
  index: format.uInt,
  epochNumber: format.uInt,
  outcomeStatus: format.uInt.$or(null),
  gasUsed: format.bigUIntDec,
  gasFee: format.bigUIntDec,
});

format.logs = parser([
  {
    epochNumber: format.uInt,
    logIndex: format.uInt,
    transactionIndex: format.uInt,
    transactionLogIndex: format.uInt,
  },
]);

format.sponsorInfo = parser({
  sponsorBalanceForCollateral: format.bigUIntDec,
  sponsorBalanceForGas: format.bigUIntDec,
  sponsorGasBound: format.bigUIntDec,
});

format.rewardInfo = parser([
  {
    baseReward: format.bigUIntDec,
    totalReward: format.bigUIntDec,
    txFee: format.bigUIntDec,
  },
]);

module.exports = format;
