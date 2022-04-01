const TESTNET_MOCK_SERVER = 'http://47.93.101.243';

function isHash(hash) {
  return typeof hash === 'string' && hash.startsWith('0x') && hash.length === 66;
}

module.exports = {
  TESTNET_MOCK_SERVER,
  TESTNET_NETWORK_ID: 1,
  ZERO_HASH: '0x0000000000000000000000000000000000000000000000000000000000000000',
  isHash,
};
