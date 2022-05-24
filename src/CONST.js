const JSBI = require('./util/jsbi');

/**
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt
 */
JSBI.prototype.toJSON = function () {
  return this.toString();
};

/** @constant {number} */
const WORD_BYTES = 32; // byte number pre abi word

/** @constant {number} */
const WORD_CHARS = WORD_BYTES * 2;

/** @constant {BigInt} */
const UINT_BOUND = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(WORD_BYTES * 8)); // 2**256

/** @constant {BigInt} */
const MAX_UINT = JSBI.subtract(UINT_BOUND, JSBI.BigInt(1)); // 2**256-1

/**
 * Enum for epochNumber tag
 * @readonly
 * @enum {string}
 *
 * - `LATEST_MINED` 'latest_mined': latest epoch.
 * - `LATEST_STATE` 'latest_state': latest state, about 5 epoch less then `LATEST_MINED`
 * - `LATEST_FINALIZED` 'latest_finalized': latest epoch which finalized by PoS chain.
 * - `LATEST_CONFIRMED` 'latest_confirmed': latest epoch which confirmation risk less 1e-8.
 * - `LATEST_CHECKPOINT` 'latest_checkpoint': latest check point epoch.
 * - `EARLIEST` 'earliest': earliest epoch number, same as 0.
 */
const EPOCH_NUMBER = {
  LATEST_MINED: 'latest_mined',
  LATEST_STATE: 'latest_state',
  LATEST_FINALIZED: 'latest_finalized',
  LATEST_CONFIRMED: 'latest_confirmed',
  LATEST_CHECKPOINT: 'latest_checkpoint',
  EARLIEST: 'earliest',
};

/**
 * Min gas price for transaction
 * @constant {number}
 * @example
 * > CONST.MIN_GAS_PRICE
 1000000000
 */
const MIN_GAS_PRICE = 1000000000; // 1Gdrip

/**
 * Gas use for pure transfer transaction
 * @constant {number}
 * @example
 * > CONST.TRANSACTION_GAS
 21000
 */
const TRANSACTION_GAS = 21000;

/**
 * Storage limit for pure transfer transaction
 * @constant {number}
 * @example
 * > CONST.TRANSACTION_STORAGE_LIMIT
 0
 */
const TRANSACTION_STORAGE_LIMIT = 0;

/**
 * Mainnet chainId
 * @constant {number}
 * @example
 * > CONST.MAINNET_ID
 1029
 */
const MAINNET_ID = 1029;

/**
 * Testnet chainId
 * @constant {number}
 * @example
 * > CONST.TESTNET_ID
 1
 */
const TESTNET_ID = 1;

/**
 * Zero address
 * @constant {string}
 * @example
 * > ZERO_ADDRESS
 0x0000000000000000000000000000000000000000
 */
const ZERO_ADDRESS_HEX = '0x0000000000000000000000000000000000000000';

/** @constant {string} */
const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Pending transaction status
 * @readonly
 * @enum {string}
 *
 * - `FUTURE_NONCE` 'futureNonce': pending because future nonce
 * - `NOT_ENOUGH_CASH` 'notEnoughCash': pending because insufficient balance
 */
const PENDING_TX_STATUS = {
  FUTURE_NONCE: 'futureNonce',
  NOT_ENOUGH_CASH: 'notEnoughCash',
};

/**
 * Enum for trace action types
 * @readonly
 * @enum {string}
 */
const ACTION_TYPES = {
  CALL: 'call',
  CREATE: 'create',
  CALL_RESULT: 'call_result',
  CREATE_RESULT: 'create_result',
  INTERNAL_TRANSFER_ACTION: 'internal_transfer_action',
};

/**
 * Enum for trace pocket types
 * @readonly
 * @enum {string}
 */
const POCKET_ENUM = {
  BALANCE: 'balance',
  STAKING_BALANCE: 'staking_balance',
  STORAGE_COLLATERAL: 'storage_collateral',
  SPONSOR_BALANCE_FOR_GAS: 'sponsor_balance_for_gas',
  SPONSOR_BALANCE_FOR_COLLATERAL: 'sponsor_balance_for_collateral',
  MINT_BURN: 'mint_burn',
  GAS_PAYMENT: 'gas_payment',
};

/**
 * Enum for trace call types
 * @readonly
 * @enum {string}
 */
const CALL_TYPES = {
  NONE: 'none',
  CALL: 'call',
  CALL_CODE: 'callcode',
  DELEGATE_CALL: 'delegatecall',
  STATIC_CALL: 'staticcall',
};

/**
 * Enum for trace create types
 * @readonly
 * @enum {string}
 */
const CREATE_TYPES = {
  NONE: 'none',
  CREATE: 'create',
  CREATE2: 'create2',
};

/**
 * Enum for space type
 * @readonly
 * @enum {string}
 */
const SPACE_ENUM = {
  NONE: 'none',
  NATIVE: 'native',
  EVM: 'evm',
};

/**
 * Enum for trace call status
 * @readonly
 * @enum {string}
 */
const CALL_STATUS = {
  SUCCESS: 'success',
  REVERTED: 'reverted',
  FAIL: 'fail',
};

/**
 * Enum for transaction.status and receipt.outcomeStatus
 * @readonly
 * @enum {number}
 */
const TX_STATUS = {
  UNEXECUTE: null, // If tx is not packed or in the defer state or executed in other block
  SUCCESS: 0,
  FAIL: 1,
  SKIP: 2,
};

/**
 * Enum for address types
 * @readonly
 * @enum {string}
 */
const ADDRESS_TYPES = {
  USER: 'user',
  CONTRACT: 'contract',
  BUILTIN: 'builtin',
  NULL: 'null',
};

/**
 * KECCAK (i.e. Keccak) hash of the empty bytes string.
 * @constant {string}
 * */
const KECCAK_EMPTY = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

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
  PENDING_TX_STATUS,
  ACTION_TYPES,
  CALL_TYPES,
  CALL_STATUS,
  POCKET_ENUM,
  TX_STATUS,
  CREATE_TYPES,
  SPACE_ENUM,
  KECCAK_EMPTY,
  ZERO_HASH,
  ADDRESS_TYPES,
};
