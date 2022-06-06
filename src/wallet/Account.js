const Transaction = require('../Transaction');
const Message = require('../Message');

/**
 * Account abstract class
 */
class Account {
  /**
   * @param {string} address
   */
  constructor(address) {
    this.address = address;
  }

  /**
   * @param {object} options
   * @return {Promise<import('../Transaction').Transaction>}
   */
  async signTransaction(options) {
    return new Transaction(options);
  }

  /**
   * @param {string} message
   * @return {Promise<import('../Message').Message>}
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

  /**
   * @return {string} Address as JSON string.
   */
  toJSON() {
    return this.address;
  }
}

module.exports = Account;
