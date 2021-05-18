const lodash = require('lodash');
const { encode, decode } = require('@conflux-dev/conflux-address-js');
const { checksumAddress } = require('./sign');

/**
 * Encode address buffer to new CIP37 address
 *
 * @param addressBuffer {buffer}
 * @param netId {number}
 * @param verbose {boolean}
 * @return {string}
 *
 * @example
 * cfx:aasyczc5bt792087z25kxutwj9t13sbsmy0rc60zju
 */
function encodeCfxAddress(addressBuffer, netId, verbose = false) {
  return encode(addressBuffer, netId, verbose);
}

/**
 * Decode CIP37 address to hex40 address with type, netId info
 *
 * @param address {string}
 * @return {Object}
 *
 * @example
 {
    "hexAddress": "an address buffer",
    "netId": 1029,
    "type": "user"
 }
 */
function decodeCfxAddress(address) {
  return decode(address);
}

/**
 * Check whether a given address is valid, will return a boolean value
 *
 * @param address {string}
 * @return {boolean}
 *
 */
function isValidCfxAddress(address) {
  if (!lodash.isString(address)) {
    return false;
  }
  try {
    decodeCfxAddress(address.toLowerCase());
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check whether a given address is valid, if not valid will throw an error
 *
 * @param address {string}
 *
 */
function verifyCfxAddress(address) {
  decodeCfxAddress(address.toLowerCase());
  return true;
}

/**
 * Check conflux address's prefix
 *
 * @param address {string}
 * @return {boolean}
 *
 * @example
 */
function hasNetworkPrefix(address) {
  if (!lodash.isString(address)) {
    return false;
  }
  const parts = address.toLowerCase().split(':');
  if (parts.length !== 2 && parts.length !== 3) {
    return false;
  }
  const prefix = parts[0];
  if (prefix === 'cfx' || prefix === 'cfxtest') {
    return true;
  }
  return prefix.startsWith('net') && /^([1-9]\d*)$/.test(prefix.slice(3));
}

/**
 * Makes a ethereum checksum address
 *
 * > Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
 * > Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet
 *
 * @param address {string} - Hex string
 * @return {string}
 *
 * @example
 * > ethChecksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
 */
function ethChecksumAddress(address) {
  return checksumAddress(address);
}

/**
 * simplify a verbose address
 *
 * @param address {string}
 * @return {string}
 *
 */
function simplifyCfxAddress(address) {
  if (!lodash.isString(address) || !hasNetworkPrefix(address)) {
    throw new Error('invalid base32 address');
  }
  const parts = address.toLocaleLowerCase().split(':');
  if (parts.length !== 3) {
    return address;
  }
  return `${parts[0]}:${parts[2]}`;
}

/**
 * Convert an ethereum address to conflux hex address by replace it's first letter to 1
 */
function ethAddressToCfxAddress(address) {
  return `0x1${address.toLowerCase().slice(3)}`;
}

module.exports = {
  encodeCfxAddress,
  decodeCfxAddress,
  verifyCfxAddress,
  isValidCfxAddress,
  hasNetworkPrefix,
  ethChecksumAddress,
  simplifyCfxAddress,
  ethAddressToCfxAddress,
};
