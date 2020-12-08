const Transaction = require('../../Transaction');

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
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param [password] {string} - See [conflux.sendTransaction](#Conflux.js/Conflux/sendTransaction)
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   */
  sendTransaction(options, password) {
    return this.method.conflux.sendTransaction({ ...this, ...options }, password);
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param epochNumber {string|number} - See [Conflux.estimateGasAndCollateral](#Conflux.js/estimateGasAndCollateral)
   * @return {Promise<object>} The gas used and storage occupied for the simulated call/transaction.
   */
  async estimateGasAndCollateral(options, epochNumber) {
    return this.method.conflux.estimateGasAndCollateral({ ...this, ...options }, epochNumber);
  }

  /**
   * Executes a message call transaction,
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: Can not alter the smart contract state.
   *
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param epochNumber {string|number} - See [Conflux.call](#Conflux.js/call)
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    const hex = await this.method.conflux.call({ ...this, ...options }, epochNumber);
    return this.method.decodeOutputs(hex);
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
