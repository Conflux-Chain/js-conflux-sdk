const { FunctionCoder } = require('../abi');
const callable = require('../lib/callable');

/**
 * @memberOf Contract
 */
class Called {
  constructor(cfx, method, { to, data }) {
    this.cfx = cfx;
    this.method = method;
    this.to = to;
    this.data = data;
  }

  /**
   * Will send a transaction to the smart contract and execute its method.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: This can alter the smart contract state.
   *
   * @param options {object} - See `format.sendTx`
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   */
  sendTransaction(options) {
    return this.cfx.sendTransaction({
      to: this.to,
      data: this.data,
      ...options,
    });
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * @param options {object} - See `format.sendTx`
   * @return {Promise<number>} The used gas for the simulated call/transaction.
   */
  estimateGas(options) {
    return this.cfx.estimateGas({
      to: this.to,
      data: this.data,
      ...options,
    });
  }

  /**
   * Executes a message call transaction,
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: Can not alter the smart contract state.
   *
   * @param options {object} - See `format.sendTx`.
   * @param epochNumber {string|number} - See `Conflux.call`.
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    const result = await this.cfx.call(
      {
        to: this.to,
        data: this.data,
        ...options,
      },
      epochNumber,
    );
    return this.method.decode(result);
  }

  async then(resolve, reject) {
    try {
      const result = await this.call();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }
}

class ContractFunction {
  constructor(cfx, contract, fragment) {
    this.cfx = cfx;
    this.contract = contract;
    this.fragment = fragment;

    this.coder = new FunctionCoder(this.fragment);
    this.code = this.coder.signature();

    return callable(this, this.call.bind(this));
  }

  call(...params) {
    return new Called(this.cfx, this, {
      to: this.contract.address,
      data: this.encode(params),
    });
  }

  encode(params) {
    const hex = this.coder.encodeInputs(params);
    return `${this.code}${hex.substring(2)}`;
  }

  decode(hex) {
    const array = this.coder.decodeOutputs(hex);
    return array.length <= 1 ? array[0] : array;
  }
}

module.exports = ContractFunction;
