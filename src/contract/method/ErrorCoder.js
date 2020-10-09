const FunctionCoder = require('./FunctionCoder');

class ErrorCoder extends FunctionCoder {
  constructor() {
    super({ name: 'Error', inputs: [{ type: 'string', name: 'message' }] });
  }

  decodeError(error) {
    try {
      const hex = JSON.parse(error.data);
      const { message } = this.decodeData(hex);
      return new Error(message);
    } catch (e) {
      return error;
    }
  }
}

module.exports = ErrorCoder;
