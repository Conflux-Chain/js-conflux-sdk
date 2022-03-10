import FunctionCoder from './FunctionCoder.js';

export default class ErrorCoder extends FunctionCoder {
  constructor() {
    super({ name: 'Error', inputs: [{ type: 'string', name: 'message' }] });
  }

  decodeError(error) {
    try {
      const { message } = this.decodeData(error.data);
      return new Error(message);
    } catch (e) {
      return error;
    }
  }
}
