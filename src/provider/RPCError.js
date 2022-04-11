const { isHexString } = require('../util');
const format = require('../util/format');

class RPCError extends Error {
  constructor(object, payload = {}) {
    supplementErrorInfo(object, payload);
    super(object);
    Object.assign(this, object);
    Object.assign(this, payload);
  }
}

module.exports = RPCError;

function supplementErrorInfo(object, payload) {
  // If use base32 address with full node before v1.1.1, will encounter this error
  if (object.message.match('0x prefix is missing')) {
    object.data = 'You should connect a node with version 1.1.1 or pass a valid hex value';
    return;
  }
  if (object.message === 'Method not found' && payload.method === 'cfx_sendTransaction') {
    object.message = `${object.message} Can't find 'from' in cfx.wallet, check 'error.data' for detail`;
    object.data = 'Please use cfx.wallet.addPrivateKey() to add a account before call cfx.sendTransaction()';
  }
  // decode hex encoded error message
  if (isHexString(object.data)) {
    object.data = format.hexBuffer(object.data).toString();
  }
}
