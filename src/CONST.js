const JSBI = require('./util/jsbi');

JSBI.prototype.toJSON = function () {
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  return this.toString();
};

const WORD_BYTES = 32; // byte number pre abi word
const WORD_CHARS = WORD_BYTES * 2;
const UINT_BOUND = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(WORD_BYTES * 8)); // 2**256
const MAX_UINT = JSBI.subtract(UINT_BOUND, JSBI.BigInt(1)); // 2**256-1

/**
 * epochNumber label
 *
 * - `LATEST_MINED` 'latest_mined': latest epoch.
 * - `LATEST_STATE` 'latest_state': latest state, about 5 epoch less then `LATEST_MINED`
 * - `LATEST_CONFIRMED` 'latest_confirmed': latest epoch which confirmation risk less 1e-8.
 * - `LATEST_CHECKPOINT` 'latest_checkpoint': latest check point epoch.
 * - `EARLIEST` 'earliest': earliest epoch number, same as 0.
 */
const EPOCH_NUMBER = {
  LATEST_MINED: 'latest_mined',
  LATEST_STATE: 'latest_state',
  LATEST_CONFIRMED: 'latest_confirmed',
  LATEST_CHECKPOINT: 'latest_checkpoint',
  EARLIEST: 'earliest',
};

/**
 * min gas price for transaction
 *
 * @type {number}
 * @example
 * > CONST.MIN_GAS_PRICE
 1
 */
const MIN_GAS_PRICE = 1;

/**
 * gas use for pure transfer transaction
 *
 * @type {number}
 * @example
 * > CONST.TRANSACTION_GAS
 21000
 */
const TRANSACTION_GAS = 21000;

/**
 * storage limit for pure transfer transaction
 *
 * @type {number}
 * > CONST.TRANSACTION_STORAGE_LIMIT
 0
 */
const TRANSACTION_STORAGE_LIMIT = 0;

/**
 * mainnet chainId
 *
 * @type {number}
 * > CONST.MAINNET_ID
 1029
 */
const MAINNET_ID = 1029;

/**
 * testnet chainId
 *
 * @type {number}
 * > CONST.TESTNET_ID
 1
 */
const TESTNET_ID = 1;

/**
 * zero address
 *
 * @type {string}
 * > ZERO_ADDRESS
 0x0000000000000000000000000000000000000000
 */
const ZERO_ADDRESS_HEX = '0x0000000000000000000000000000000000000000';

module.exports = {
  WORD_BYTES,
  WORD_CHARS,
  UINT_BOUND,
  MAX_UINT,
  EPOCH_NUMBER,
  MIN_GAS_PRICE,
  TRANSACTION_GAS,
  TRANSACTION_STORAGE_LIMIT,
  TESTNET_ID,
  MAINNET_ID,
  ZERO_ADDRESS_HEX,
};
