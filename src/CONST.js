const JSBI = require('jsbi');

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
 * - LATEST_MINED 'latest_mined': latest epoch.
 * - LATEST_STATE 'latest_state': latest state, about 5 epoch less then `LATEST_MINED`
 * - LATEST_CONFIRMED 'latest_confirmed': latest epoch which confirmation risk less 1e-8.
 * - LATEST_CHECKPOINT 'latest_checkpoint': latest check point epoch.
 * - EARLIEST 'earliest': earliest epoch number, same as 0.
 */
const EPOCH_NUMBER = {
  LATEST_MINED: 'latest_mined',
  LATEST_STATE: 'latest_state',
  LATEST_CONFIRMED: 'latest_confirmed',
  LATEST_CHECKPOINT: 'latest_checkpoint',
  EARLIEST: 'earliest',
};

module.exports = {
  WORD_BYTES,
  WORD_CHARS,
  UINT_BOUND,
  MAX_UINT,
  EPOCH_NUMBER,
};
