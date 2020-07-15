const format = require('../util/format');
const { decorate } = require('../util');
const { PendingTransaction } = require('../subscribe');

class BaseAccount {
  /**
   * @param address {string}
   * @param conflux {Conflux}
   */
  constructor(address, conflux) {
    this.address = format.address(address);
    this.conflux = conflux;

    this.sendTransaction = decorate(this.sendTransaction, (func, ...args) => {
      return new PendingTransaction(func, args, this.conflux);
    });
  }

  /**
   * @param options {Object}
   * @return {Promise<Transaction>}
   */
  async signTransaction(options) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name}.signTransaction not implemented`);
  }

  /**
   * @param options {Object}
   * @return {Promise<Message>}
   */
  async signMessage(options) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name}.signMessage not implemented`);
  }

  /**
   * @return {string} Address as string.
   */
  toString() {
    return this.address;
  }

  // --------------------------------------------------------------------------
  async sendTransaction({ ...options }) {
    options.from = this.address; // must set from to address for `estimateGasAndCollateral`
    if (options.nonce === undefined) {
      options.nonce = await this.conflux.getNextNonce(this.address);
    }

    if (options.chainId === undefined) {
      const status = await this.conflux.getStatus();
      options.chainId = status.chainId;
    }

    if (options.epochHeight === undefined) {
      options.epochHeight = await this.conflux.getEpochNumber();
    }

    if (options.gasPrice === undefined) {
      if (this.conflux.defaultGasPrice === undefined) {
        options.gasPrice = await this.conflux.getGasPrice() || 1; // MIN_GAS_PRICE
      } else {
        options.gasPrice = this.conflux.defaultGasPrice;
      }
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      const { gasUsed, storageCollateralized } = await this.conflux.estimateGasAndCollateral(options);

      if (options.gas === undefined) {
        options.gas = gasUsed;
      }

      if (options.storageLimit === undefined) {
        options.storageLimit = storageCollateralized;
      }
    }

    const transaction = await this.signTransaction(options);
    return this.conflux.sendRawTransaction(transaction.serialize());
  }
}

module.exports = BaseAccount;
