const {
  encode,
  decode,
  verifyCfxAddress,
  isValidCfxAddress,
  hasNetworkPrefix,
  simplifyCfxAddress,
  shortenCfxAddress,
} = require('@conflux-dev/conflux-address-js');
const { checksumAddress } = require('./sign');

const ADDRESS_TYPES = {
  USER: 'user',
  CONTRACT: 'contract',
  BUILTIN: 'builtin',
  NULL: 'null',
};

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
 * Convert an ethereum address to conflux hex address by replace it's first letter to 1
 * @param address {string}
 * @return {string}
 */
function ethAddressToCfxAddress(address) {
  return `0x1${address.toLowerCase().slice(3)}`;
}

module.exports = {
  encodeCfxAddress: encode,
  decodeCfxAddress: decode,
  verifyCfxAddress,
  isValidCfxAddress,
  hasNetworkPrefix,
  ethChecksumAddress,
  simplifyCfxAddress,
  ethAddressToCfxAddress,
  shortenCfxAddress,
  ADDRESS_TYPES,
};
