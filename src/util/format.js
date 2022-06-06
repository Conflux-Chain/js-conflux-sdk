const Big = require('big.js');
const lodash = require('lodash');
const CONST = require('../CONST');
const JSBI = require('./jsbi');
const parser = require('./parser');
const sign = require('./sign');
const addressUtil = require('./address');
const { isHexString, isBytes } = require('./index');

// ----------------------------------------------------------------------------
function toHex(value) {
  let hex;

  if (lodash.isString(value)) {
    hex = value.toLowerCase(); // XXX: lower case for support checksum address
  } else if (Number.isInteger(value) || (typeof value === 'bigint') || (value instanceof JSBI)) {
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
    throw new Error(`${value} not match "hex"`);
  }
  return hex.length % 2 ? `0x0${hex.slice(2)}` : hex;
}

function toNumber(value) {
  if (value === null) {
    throw new Error(`${value} not match "number"`);
  } else if (Buffer.isBuffer(value)) {
    value = `0x${value.toString('hex')}`;
  }
  return Number(value);
}

function toBigInt(value) {
  if (Number.isInteger(value) || (typeof value === 'bigint') || (value instanceof JSBI)) {
    return JSBI.BigInt(value);
  }
  if (lodash.isBoolean(value)) {
    throw new Error(`${value} not match "BigInt"`);
  }
  if (Buffer.isBuffer(value)) {
    throw new Error(`${value} not match "BigInt"`);
  }

  value = `${value}`.replace(/^(-?\d+)(.0+)?$/, '$1'); // replace "number.000" to "number"
  return JSBI.BigInt(value);
}

function toBig(value) {
  if (/^0[xob]/i.test(value)) {
    value = JSBI.BigInt(value);
  }
  return new Big(value);
}

// ----------------------------------------------------------------------------
const format = new Proxy(() => undefined, {
  apply(target, thisArg, argArray) {
    return parser(...argArray);
  },
});

/**
 * Do nothing for the given value.
 * @function any
 * @param {any} arg
 * @return {any} arg
 *
 * @example
 * > format.any(1)
 1
 */
format.any = format(v => v, { name: 'format.any' });

/**
 * format input to number
 * @function uInt
 * @param {number|BigInt|string|boolean} arg
 * @return {number}
 *
 * @example
 * > format.uInt(-3.14)
 Error("not match uint")
 * > format.uInt(null)
 Error("not match number")
 * > format.uInt('0')
 0
 * > format.uInt(1)
 1
 * > format.uInt(BigInt(100))
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
format.uInt = format(toNumber, { name: 'format.uInt' }).$validate(v => Number.isSafeInteger(v) && v >= 0, 'uint');

/**
 * @function bigInt
 * @param {number|string|BigInt} arg
 * @return {BigInt}
 *
 * @example
 * > format.bigInt(-3.14)
 Error("Cannot convert -3.14 to a BigInt")
 * > format.bigInt('0.0')
 0n
 * > format.bigInt('-1')
 -1n
 * > format.bigInt(1)
 1n
 * > format.bigInt(BigInt(100))
 100n
 * > format.bigInt('0x10')
 16n
 * > format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 9007199254740992n
 */
format.bigInt = format(toBigInt, { name: 'format.bigInt' });

/**
 * @function bigIntFromBuffer
 * @param {Buffer} arg
 * @return {BigInt}
 */
format.bigIntFromBuffer = format.bigInt.$before(v => (v.length === 0 ? '0x0' : format.hex(v)));

/**
 * @function bigUInt
 * @param {number|string|BigInt} arg
 * @return {BigInt}
 *
 * @example
 * > format.bigUInt('0.0')
 0n
 * > format.bigUInt('-1')
 Error("not match bigUInt")
 */
format.bigUInt = format.bigInt.$validate(v => v >= 0, 'bigUInt');

/**
 * When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")
 *
 * @function bigUIntHex
 * @param {number|string|BigInt} arg
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
 * @function big
 * @param {number|string|BigInt} arg
 * @return {Big} Big instance
 *
 * @example
 * > format.big('0b10').toString()
 '2'
 * > format.big('0O10').toString()
 '8'
 * > format.big('010').toString()
 '10'
 * > format.big('0x10').toString()
 '16'
 * > format.big(3.14).toString()
 '3.14'
 * > format.big('-03.140').toString()
 '-3.14'
 * > format.big(null)
 Error('Invalid number')
 */
format.big = format(toBig, { name: 'format.big' });

/**
 * @function fixed64
 * @param {string|number|BigInt|Big} arg
 * @return {Number}
 *
 * @example
 * > format.fixed64('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
 * > format.fixed64('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 0.5
 */
format.fixed64 = format.big.$after(v => Number(v.div(CONST.MAX_UINT)));

/**
 * @function epochNumber
 * @param {number|string} arg - number or label, See [EPOCH_NUMBER](Misc.md#CONST.js/EPOCH_NUMBER)
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
  .$or(CONST.EPOCH_NUMBER.LATEST_MINED)
  .$or(CONST.EPOCH_NUMBER.LATEST_STATE)
  .$or(CONST.EPOCH_NUMBER.LATEST_FINALIZED)
  .$or(CONST.EPOCH_NUMBER.LATEST_CONFIRMED)
  .$or(CONST.EPOCH_NUMBER.LATEST_CHECKPOINT)
  .$or(CONST.EPOCH_NUMBER.EARLIEST);

format.epochNumberOrUndefined = format.epochNumber.$or(undefined);

/**
 * When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
 *
 * @function hex
 * @param {number|BigInt|string|Buffer|boolean|null} arg
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
format.hex = format(toHex, { name: 'format.hex' });

/**
 * @function hex40
 * @param {string|Buffer} arg
 * @return {string} hex40 address
 */
format.hex40 = format.hex.$validate(v => v.length === 2 + 40, 'hex40');

function toAddress(address, networkId, verbose = false) {
  // if is an (Account) object, convert it to string (address)
  if (lodash.isObject(address) && addressUtil.hasNetworkPrefix(address.toString())) {
    address = address.toString();
  }
  if (lodash.isString(address) && addressUtil.hasNetworkPrefix(address)) {
    const _decodedAddress = addressUtil.decodeCfxAddress(address);
    address = _decodedAddress.hexAddress;
    networkId = networkId || _decodedAddress.netId;
  }
  address = format.hexBuffer(address);
  if (address.length !== 20) {
    throw new Error('not match "hex40"');
  }
  if (typeof networkId === 'undefined') {
    throw new Error('expected parameter: networkId');
  }
  return addressUtil.encodeCfxAddress(address, networkId, verbose);
}

/**
 * Checks if a given string is a valid address.
 * @function address
 * @param {string|Buffer} address
 * @param {number} networkId
 * @param {boolean} [verbose=false] - if you want a address with type info, pass true
 * @return {string} Hex string
 *
 * @example
 * > format.address('0x0123456789012345678901234567890123456789', 1)
 "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
 * > format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
 */
format.address = format(toAddress, { name: 'format.address' });

/**
 * create a address formatter with networkId info
 */
format.netAddress = (networkId, verbose = false) => format(address => toAddress(address, networkId, verbose));

/**
 * Checks if a given string is a valid hex address.
 * It will also check the checksum, if the address has upper and lowercase letters.
 *
 * @function hexAddress
 * @param {string|Buffer} address
 * @return {string} Hex string
 *
 * @example
 * > format.hexAddress('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
 * > format.hexAddress('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
 * > format.hexAddress('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
 0x0123456789012345678901234567890123456789
 */
format.hexAddress = format.hex40.$before(address => {
  if (lodash.isString(address) && addressUtil.hasNetworkPrefix(address)) {
    address = addressUtil.decodeCfxAddress(address).hexAddress;
  }

  if (isHexString(address) && address.length !== 2 + 40) {
    throw new Error('not match "hex40"');
  }

  if (isHexString(address)
    && address !== address.toLowerCase()
    && address !== address.toUpperCase()
    && address !== sign.checksumAddress(address)
  ) {
    throw new Error(`address "${address}" checksum error`);
  }

  return address;
});

/**
 * Will convert an upper or lowercase address to a checksum address.
 *
 * @function checksumAddress
 * @deprecated Please use address.ethChecksumAddress
 * @param {string|Buffer} arg
 * @return {string} Checksum address hex string
 *
 * @example
 * > format.checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
 * > format.checksumAddress('0X1B716C51381E76900EBAA7999A488511A4E1FD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
 * > format.checksumAddress('0x1B716c51381e76900EBAA7999A488511A4E1fD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
 */
format.checksumAddress = format.hex40.$after(sign.checksumAddress);

/** @type {function(string): string} */
format.hex64 = format.hex.$validate(v => v.length === 2 + 64, 'hex64');

/**
 * @function blockHash
 * @param {string|Buffer} arg
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.blockHash = v => format.hex64(v); // alias

/**
 * @function transactionHash
 * @param {string|Buffer} arg
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.transactionHash = v => format.hex64(v); // alias

/**
 * @function privateKey
 * @param {string|Buffer} arg
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.privateKey = v => format.hex64(v); // alias

/**
 * @function publicKey
 * @param {string|Buffer} arg
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
 * @function hexBuffer
 * @param {number|string|BigInt|Buffer|boolean|null} arg
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
 * It can only be in hex format If want to pass a string
 * @function bytes
 * @param {string|Buffer|array} arg
 * @return {Buffer}
 *
 * @example
 * > format.bytes('0xabcd')
 <Buffer ab cd>
 * > format.bytes([0, 1])
 <Buffer 00 01>
 * > format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
 */
format.bytes = format(v => {
  if (isHexString(v)) return format.hexBuffer(v);
  if (Buffer.isBuffer(v) || isBytes(v)) return Buffer.from(v);
  throw new Error('invalid arrayify value');
}, { name: 'format.bytes' });

/**
 * @function boolean
 * @param {boolean} arg
 * @return {boolean}
 *
 * @example
 * > format.boolean(true)
 true
 * > format.boolean(false)
 false
 */
format.boolean = format.any.$validate(lodash.isBoolean, 'boolean');

/**
 * Compute the keccak256 cryptographic hash of a value, returned as a hex string.
 *
 * @function keccak256
 * @param {string|Buffer} arg
 * @return {string}
 *
 * @example
 * > format.keccak256('Transfer(address,address,uint256)')
 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

 * > format.keccak256(Buffer.from([0x42]))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
 * > format.keccak256(format.hexBuffer('0x42'))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
 * > format.keccak256('0x42') // "0x42" as string and transfer to <Buffer 30 78 34 32> by ascii
 "0x3c1b2d38851281e9a7b59d10973b0c87c340ff1e76bde7d06bf6b9f28df2b8c0"
 */
format.keccak256 = format.bytes.$before(v => (lodash.isString(v) && !isHexString(v) ? Buffer.from(v) : v)).$after(sign.keccak256).$after(format.hex);

module.exports = format;
