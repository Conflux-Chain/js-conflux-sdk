const FunctionCoder = require('./FunctionCoder');

const errorCoder = new FunctionCoder({ name: 'Error', inputs: [{ type: 'string', name: 'message' }] });

function decodeError(error) {
  try {
    const hex = JSON.parse(error.data);
    const { message } = errorCoder.decodeData(hex);
    return new Error(message);
  } catch (e) {
    return error;
  }
}

module.exports = decodeError;
