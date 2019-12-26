/*
# Why starts with uppercase?
  - emphasis there are kind of type
  - less names conflict

# Why use lambda?
  - should be pure functions
 */

const lodash = require('lodash');
const BigNumber = require('bignumber.js');

BigNumber.config({
  EXPONENTIAL_AT: 1e9,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
});

// ----------------------------------- Hex ------------------------------------
/**
 * Hex formatter, trans value to hex string
 *
 * @memberOf type
 * @param value {string|number|Buffer|Date|BigNumber|null} - The value to gen hex string.
 * @return {string} Hex string.
 *
 * @example
 * > Hex(null)
 "0x"
 * > Hex(1) // also BigNumber
 "0x01"
 * > Hex('10') // from naked hex string
 "0x10"
 * > Hex('0x1') // pad prefix 0 auto
 "0x01"
 * > Hex(Buffer.from([1, 2]))
 "0x0102"
 */
const Hex = value => {
  if (value === null) {
    return '0x';
  }

  if (lodash.isNumber(value) || BigNumber.isBigNumber(value)) {
    return Hex(value.toString(16));
  }

  if (lodash.isString(value)) {
    if (Hex.isHex(value)) { // In order not to copy hex string in most case.
      return value;
    }

    let string = value.toLowerCase();
    string = string.startsWith('0x') ? string : `0x${string}`;
    string = string.length % 2 ? `0x0${string.substring(2)}` : string;
    if (!Hex.isHex(string)) {
      throw new Error(`"${value}" do not match hex string`);
    }
    return string;
  }

  if (Buffer.isBuffer(value)) {
    return `0x${value.toString('hex')}`;
  }

  if (lodash.isDate(value)) {
    return Hex(value.valueOf());
  }

  return Hex(`${value}`); // for magic method `toString`
};

/**
 * Check if is hex string.
 *
 * > Hex: /^0x([0-9a-f][0-9a-f])*$/
 *
 * @param hex {string} - Value to be check.
 * @return {boolean}
 *
 * @example
 * > Hex.isHex('0x')
 true
 * > Hex.isHex('0x01')
 true
 * > Hex.isHex('0x1')
 false
 * > Hex.isHex('01')
 false
 */
Hex.isHex = hex => {
  return /^0x([0-9a-f][0-9a-f])*$/.test(hex);
};

/**
 * Get hex string from number.
 *
 * @param value {number|BigNumber|string}
 * @return {string}
 *
 * @example
 * > Hex.fromNumber('10')
 "0x0a"
 * > Hex('10')
 "0x10"
 */
Hex.fromNumber = value => {
  return Hex(lodash.isNumber(value) ? value : BigNumber(value));
};

/**
 * Get `Buffer` by `Hex` string.
 *
 * > NOTE: It's importance to only support `Hex` string, cause `Transaction.encode` will not check hex again.
 *
 * @param hex {string} - The hex string.
 * @return {Buffer}
 *
 * @example
 * > Hex.toBuffer('0x0102')
 <Buffer 01 02>
 */
Hex.toBuffer = hex => {
  if (!Hex.isHex(hex)) {
    throw new Error(`"${hex}" do not match hex string`);
  }

  return Buffer.from(hex.substring(2), 'hex');
};

/**
 * Concat `Hex` string by order.
 *
 * @param values {array} - Array of hex string
 * @return {string}
 *
 * @example
 * > Hex.concat('0x01', '0x02', '0x0304')
 "0x01020304"
 * > Hex.concat()
 "0x"
 */
Hex.concat = (...values) => {
  values.forEach((value, index) => {
    if (!Hex.isHex(value)) {
      throw new Error(`values[${index}] do not match hex string, got "${value}"`);
    }
  });

  return `0x${values.map(v => Hex(v).substring(2)).join('')}`;
};

// ----------------------------------- Address --------------------------------
/**
 * Get and validate `Address` from value
 *
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 *
 * @example
 * > Address('0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
 */
const Address = value => {
  const hex = Hex(value);
  if (hex.length !== 2 + 2 * 20) {
    throw new Error(`${value} do not match Address`);
  }
  return hex;
};

// ------------------------------------ Hash ----------------------------------
/**
 *
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 *
 * @example
 * > Hex32('0123456789012345678901234567890123456789012345678901234567890123')
 "0x0123456789012345678901234567890123456789012345678901234567890123"
 */
const Hex32 = value => {
  const hex = Hex(value);
  if (hex.length !== 2 + 2 * 32) {
    throw new Error(`${value} do not match Hex32`);
  }
  return hex;
};

// ---------------------------------- PrivateKey ------------------------------
/**
 * Get and validate `PrivateKey` from value.
 *
 * > same as `Hex32` in coincidence
 *
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 */
const PrivateKey = value => {
  try {
    return Hex32(value);
  } catch (e) {
    throw new Error(`${value} do not match PrivateKey`);
  }
};

// ----------------------------------- BlockHash ------------------------------
/**
 * Get and validate `BlockHash` from value
 *
 * > same as `Hex32` in coincidence
 *
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 */
const BlockHash = value => {
  try {
    return Hex32(value);
  } catch (e) {
    throw new Error(`${value} do not match BlockHash`);
  }
};

// ----------------------------------- TxHash ---------------------------------
/**
 * Get and validate `TxHash` from value
 *
 * > same as `Hex32` in coincidence
 *
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 *
 * @example
 * > TxHash('0123456789012345678901234567890123456789012345678901234567890123')
 "0x0123456789012345678901234567890123456789012345678901234567890123"
 */
const TxHash = value => {
  try {
    return Hex32(value);
  } catch (e) {
    throw new Error(`${value} do not match TxHash`);
  }
};

// ---------------------------------- Drip ------------------------------------
/**
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 *
 * @example
 * > Drip(1)
 "0x01"

 * @example
 * > Drip.toGDrip(Drip.fromCFX(1));
 "1000000000"
 */
const Drip = value => {
  return Hex.fromNumber(value);
};

/**
 * Get Drip hex string by GDrip value.
 *
 * > NOTE: Rounds towards nearest neighbour. If equidistant, rounds towards zero.
 *
 * @param value {string|number|BigNumber} - Value in GDrip.
 * @return {string} Hex string in drip.
 *
 * @example
 * > Drip.fromGDrip(1)
 "0x3b9aca00"
 * > Drip.fromGDrip(0.1)
 "0x05f5e100"
 */
Drip.fromGDrip = value => {
  const number = BigNumber(value).times(1e9);
  return Drip(number.integerValue());
};

/**
 * Get Drip hex string by CFX value.
 *
 * > NOTE: Rounds towards nearest neighbour. If equidistant, rounds towards zero.
 *
 * @param value {string|number|BigNumber} - Value in CFX.
 * @return {string} Hex string in drip.
 *
 * @example
 * > Drip.fromCFX(1)
 "0x0de0b6b3a7640000"
 * > Drip.fromCFX(0.1)
 "0x016345785d8a0000"
 */
Drip.fromCFX = value => {
  const number = BigNumber(value).times(1e9).times(1e9); // XXX: 1e18 > Number.MAX_SAFE_INTEGER > 1e9
  return Drip(number.integerValue());
};

/**
 * Get `GDrip` from Drip.
 *
 * @param value {string|number|BigNumber}
 * @return {BigNumber}
 *
 * @example
 * > Drip.toGDrip(1e9)
 "1"
 * > Drip.toGDrip(Drip.fromCFX(1))
 "1000000000"
 */
Drip.toGDrip = value => {
  return BigNumber(value).div(1e9);
};

/**
 * Get `CFX` from Drip.
 *
 * @param value {string|number|BigNumber}
 * @return {BigNumber}
 *
 * @example
 * > Drip.toCFX(1e18)
 "1"
 * > Drip.toCFX(Drip.fromGDrip(1e9))
 "1"
 */
Drip.toCFX = value => {
  return BigNumber(value).div(1e9).div(1e9); // XXX: 1e18 > Number.MAX_SAFE_INTEGER > 1e9
};

// ------------------------------- EpochNumber --------------------------------
/**
 * Get and validate `EpochNumber` from value
 *
 * @memberOf type
 * @param value {string|number|Buffer|BigNumber}
 * @return {string}
 *
 * @example
 * > EpochNumber(0)
 "0x00"
 * > EpochNumber('100')
 "0x64"
 * > EpochNumber('LATEST_STATE')
 "latest_state"
 */
const EpochNumber = value => {
  if (lodash.isString(value)) {
    value = value.toLowerCase();
  }

  if ([EpochNumber.LATEST_STATE, EpochNumber.LATEST_MINED].includes(value)) {
    return value;
  }

  return Hex.fromNumber(value);
};

/**
 * The latest epochNumber where the latest block with an executed state in.
 *
 * @var {string}
 */
EpochNumber.LATEST_STATE = 'latest_state';

/**
 * The latest epochNumber where the latest mined block in.
 *
 * @var {string}
 */
EpochNumber.LATEST_MINED = 'latest_mined';

module.exports = {
  Hex,
  Address,
  Hex32,
  PrivateKey,
  BlockHash,
  TxHash,
  Drip,
  EpochNumber,
};
