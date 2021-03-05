class RPCError extends Error {
  constructor(object, payload = {}) {
    supplementErrorInfo(object, payload);
    super(object);
    Object.assign(this, object);
  }
}

module.exports = RPCError;

function supplementErrorInfo(object, payload) {
  if (object.message.match('0x prefix is missing')) {
    object.data = 'You should connect a node with version 1.1.1 or pass a valid hex value';
    return;
  }
  if (object.message === 'Method not found' && payload.method === 'cfx_sendTransaction') {
    object.data = 'Please use cfx.wallet.addPrivateKey() to add a account before call cfx.sendTransaction()';
  }
}
