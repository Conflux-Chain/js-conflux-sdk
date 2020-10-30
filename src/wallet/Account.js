const Transaction = require('../Transaction');
const Message = require('../Message');

class Account {
  /**
   * @param address {string}
   */
  constructor(address) {
    this.address = address;
  }

  /**
   * @param options {object}
   * @return {Promise<Transaction>}
   */
  async signTransaction(options) {
    return new Transaction(options);
  }

  /**
   * @param message {string}
   * @return {Promise<Message>}
   */
  async signMessage(message) {
    return new Message(message);
  }

  /**
   * @return {string} Address as string.
   */
  toString() {
    return this.address;
  }

  toJSON() {
    return this.address;
  }
}

module.exports = Account;
