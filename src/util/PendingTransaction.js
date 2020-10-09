const { sleep, loop } = require('./index');

class PendingTransaction {
  constructor(conflux, func, args) {
    this.conflux = conflux;
    this.func = func;
    this.args = args;
    this.promise = undefined;
  }

  async then(resolve, reject) {
    this.promise = this.promise || this.func(...this.args);

    try {
      return resolve(await this.promise);
    } catch (e) {
      return reject(e);
    }
  }

  async catch(callback) {
    return this.then(v => v, callback);
  }

  async finally(callback) {
    try {
      return await this;
    } finally {
      await callback();
    }
  }

  // --------------------------------------------------------------------------
  /**
   * Get transaction by hash.
   *
   * @param [options] {object}
   * @param [options.delay=0] {number} - Defer execute after `delay` ms.
   * @return {Promise<Object|null>} See [Conflux.getTransactionByHash](#Conflux.js/getTransactionByHash)
   */
  async get({ delay = 0 } = {}) {
    await sleep(delay);
    const transactionHash = await this;
    return this.conflux.getTransactionByHash(transactionHash);
  }

  /**
   * Async wait till transaction been mined.
   *
   * - blockHash !== null
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=60*1000] {number} - Loop timeout in ms.
   * @return {Promise<object>} See [Conflux.getTransactionByHash](#Conflux.js/getTransactionByHash)
   */
  async mined({ delta = 1000, timeout = 60 * 1000 } = {}) {
    return loop({ delta, timeout }, async () => {
      const transaction = await this.get();
      if (transaction && transaction.blockHash) {
        return transaction;
      }

      return undefined;
    });
  }

  /**
   * Async wait till transaction been executed.
   *
   * - mined
   * - receipt !== null
   * - receipt.outcomeStatus === 0
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=5*60*1000] {number} - Loop timeout in ms.
   * @return {Promise<object>} See [Conflux.getTransactionReceipt](#Conflux.js/getTransactionReceipt)
   */
  async executed({ delta = 1000, timeout = 5 * 60 * 1000 } = {}) {
    const transactionHash = await this;
    return loop({ delta, timeout }, async () => {
      const receipt = await this.conflux.getTransactionReceipt(transactionHash);
      if (receipt) {
        if (receipt.outcomeStatus !== 0) {
          throw new Error(`transaction "${transactionHash}" executed failed, outcomeStatus ${receipt.outcomeStatus}`);
        }

        return receipt;
      }

      return undefined;
    });
  }

  /**
   * Async wait till transaction been confirmed.
   *
   * - executed
   * - transaction block risk coefficient < threshold
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=30*60*1000] {number} - Loop timeout in ms.
   * @param [options.threshold=1e-8] {number} - Number in range (0,1)
   * @return {Promise<object>} See [Conflux.getTransactionReceipt](#Conflux.js/getTransactionReceipt)
   */
  async confirmed({ delta = 1000, timeout = 30 * 60 * 1000, threshold = 1e-8 } = {}) {
    return loop({ delta, timeout }, async () => {
      const receipt = await this.executed({ delta, timeout });
      const risk = await this.conflux.getConfirmationRiskByHash(receipt.blockHash);
      if (risk <= threshold) {
        return receipt;
      }

      return undefined;
    });
  }
}

module.exports = PendingTransaction;
