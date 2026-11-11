const { isHexString } = require('../util');
const format = require('../util/format');

const INVALID_PARAMS = 'Invalid params:';
const INVALID_PARAMETERS = 'Invalid parameters:';
class RPCError extends Error {
  constructor(object, payload = {}) {
    supplementErrorInfo(object, payload);
    super(object);
    Object.assign(this, object);
    Object.assign(this, payload);
  }

  // return the parameter error detail, return null if it is not an Invalid params error
  paramsErrorDetail() {
    if (this.code !== -32602) return null;
    if (this.message === 'Invalid params' && typeof this.data === 'string' && this.data) {
      return sanitizeParamsErrorDetail(this.data);
    }
    if (this.message.startsWith(INVALID_PARAMS)) {
      return sanitizeParamsErrorDetail(this.message.substring(INVALID_PARAMS.length).trim());
    }
    if (this.message.startsWith(INVALID_PARAMETERS)) {
      return sanitizeParamsErrorDetail(this.message.substring(INVALID_PARAMETERS.length).trim());
    }
    return null;
  }
}

module.exports = RPCError;

// Remove extra outer double quotes
function sanitizeParamsErrorDetail(detail) {
  if (detail[0] === '"' && detail[detail.length - 1] === '"') {
    return JSON.parse(detail);
  } else {
    return detail;
  }
}

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
