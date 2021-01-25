const lodash = require('lodash');
const { encode: encodeCfxAddress, decode: decodeCfxAddress } = require('conflux-address-js');
const { checksumAddress } = require('./sign');

/**
 * Check whether a given address is valid
 *
 * @param address {string}
 * @return {boolean}
 *
 * @example
 */
function verifyCfxAddress(address) {
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
  address = address.toLowerCase();
  const parts = address.split(':');
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

module.exports = {
  encodeCfxAddress,
  decodeCfxAddress,
  verifyCfxAddress,
  hasNetworkPrefix,
  ethChecksumAddress,
};
