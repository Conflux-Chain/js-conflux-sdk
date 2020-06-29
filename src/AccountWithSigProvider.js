const Account = require('./Account');
const Transaction = require('./Transaction');
const Message = require('./Message');

class AccountWithSigProvider extends Account {
  /**
   * Create an account that sign using a signature provider.
   *
   * @param address {string}
   * @param sigProvider {function}
   * @return {AccountWithSigProvider}
   */
  constructor(address, sigProvider) {
    super('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    this.privateKey = '';
    this.publicKey = '';
    this.address = address;
    this.sigProvider = sigProvider;
  }

  encrypt() {
    throw new Error('Unsupported method for AccountWithSigProvider');
  }

  /**
   * Sign a transaction asynchronously.
   *
   * @param options {object} - See 'Transaction'
   * @return {Transaction}
   */
  async signTransaction(options) {
    const tx = new Transaction(options);
    await this.sigProvider(this.address)(tx);
    if (tx.from !== this.address) {
      throw new Error(`Invalid signature, transaction.from !== ${this.address}`);
    }
    return tx;
  }

  /**
   * Sign a string transaction asynchronously.
   *
   * @param message {string}
   * @return {Message}
   */
  async signMessage(message) {
    const msg = new Message(message);
    await this.sigProvider(this.address)(msg);
    if (msg.from !== this.address) {
      throw new Error(`Invalid signature, message.from !== ${this.address}`);
    }
    return msg;
  }
}

module.exports = AccountWithSigProvider;
