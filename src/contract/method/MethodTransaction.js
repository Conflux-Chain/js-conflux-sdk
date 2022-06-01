const Transaction = require('../../Transaction');

/**
 * @typedef { import('../../Transaction').TransactionMeta } TransactionMeta
 */

class MethodTransaction extends Transaction {
  constructor(options, method) {
    super(options);
    Reflect.defineProperty(this, 'method', { value: method }); // XXX: use defineProperty to avoid from JSON.stringify
  }

  /**
   * Will send a transaction to the smart contract and execute its method.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: This can alter the smart contract state.
   *
   * @param {TransactionMeta} options - See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**)
   * @param {string} [password] - See [conflux.sendTransaction](#Conflux.js/Conflux/sendTransaction)
   * @return {import('../../subscribe/PendingTransaction')} The PendingTransaction object.
   */
  sendTransaction(options, ...extra) {
    return this.method.conflux.cfx.sendTransaction({ ...this, ...options }, ...extra);
  }

  populateTransaction(options) {
    return this.method.conflux.cfx.populateTransaction({ ...this, ...options });
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * @param {TransactionMeta} options - See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**)
   * @param {string|number} epochNumber - See [Conflux.estimateGasAndCollateral](#Conflux.js/estimateGasAndCollateral)
   * @return {Promise<import('../../rpc/types/formatter').EstimateResult>} The gas used and storage occupied for the simulated call/transaction.
   */
  async estimateGasAndCollateral(options, epochNumber) {
    return this.method.conflux.cfx.estimateGasAndCollateral({ ...this, ...options }, epochNumber);
  }

  /**
   * Executes a message call transaction,
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: Can not alter the smart contract state.
   *
   * @param {TransactionMeta} options - See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**)
   * @param {string|number} epochNumber - See [Conflux.call](#Conflux.js/call)
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    const hex = await this.method.conflux.cfx.call({ ...this, ...options }, epochNumber);
    return this.method.decodeOutputs(hex);
  }

  request(options, epochNumber) {
    const methodMeta = this.method.conflux.cfx.call.request({ ...this, ...options }, epochNumber);
    methodMeta.decoder = this.method.decodeOutputs.bind(this.method);
    return methodMeta;
  }

  async then(resolve, reject) {
    try {
      return resolve(await this.call());
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
}

module.exports = MethodTransaction;
