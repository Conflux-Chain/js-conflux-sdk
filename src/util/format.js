const lodash = require('lodash');
const BigNumber = require('bignumber.js');
const Parser = require('./lib/parser');

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 20, // (1 CFX = 1e18 Drip, 20>18)
  EXPONENTIAL_AT: 1e9,
});

// ----------------------------------------------------------------------------
function toHex(value) {
  let hex;

  if (lodash.isString(value)) {
    hex = value; // XXX: toLowerCase()
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

format.hex = Parser(toHex);
format.hex40 = format.hex.validate(v => v.length === 2 + 40, 'hex40');
format.hex64 = format.hex.validate(v => v.length === 2 + 64, 'hex64');
format.epochNumber = format.hex.or('latest_mined').or('latest_state');
format.address = format.hex40; // alias
format.privateKey = format.hex64; // alias
format.blockHash = format.hex64; // alias
format.txHash = format.hex64; // alias

format.number = Parser(toNumber).validate(v => Number.isFinite(v), 'number');
format.uint = format.number.validate(v => v >= 0 && Number.isSafeInteger(v), 'uint');

format.bigNumber = Parser(toBigNumber).validate(v => v.isFinite(), 'bigNumber');
format.bigUInt = format.bigNumber.parse(v => format.hex(v.integerValue()));

format.buffer = Parser(v => (Buffer.isBuffer(v) ? v : Buffer.from(format.hex(v).substring(2), 'hex')));

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
  epochNumber: format.uint,
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
  limit: format.hex.or(undefined),
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
  nonce: format.hex,
  gasPrice: format.bigUInt,
  gas: format.hex,
  to: format.address.or(undefined),
  value: format.bigUInt.or(undefined),
  data: format.hex.or(undefined),
});

format.callTx = Parser({
  from: format.address.or(undefined),
  nonce: format.hex.or(undefined),
  gasPrice: format.bigUInt.or(undefined),
  gas: format.hex.or(undefined),
  to: format.address,
  value: format.bigUInt.or(undefined),
  data: format.hex.or(undefined),
});

format.estimateTx = Parser({
  from: format.address.or(undefined),
  nonce: format.hex.or(undefined),
  gasPrice: format.bigUInt.or(undefined),
  gas: format.hex.or(undefined),
  to: format.address.or(undefined),
  value: format.bigUInt.or(undefined),
  data: format.hex.or(undefined),
});

module.exports = format;
