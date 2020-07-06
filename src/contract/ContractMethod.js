const lodash = require('lodash');
const { FunctionCoder, errorCoder } = require('../abi');
const callable = require('../lib/callable');

/**
 * @memberOf ContractMethod
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
   * @param options {object} - See [format.sendTx](#util/format.js/sendTx)
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
   * @param options {object} - See [format.estimateTx](#util/format.js/estimateTx)
   * @return {Promise<object>} The gas used and storage occupied for the simulated call/transaction.
   */
  async estimateGasAndCollateral(options) {
    try {
      return await this.cfx.estimateGasAndCollateral({ to: this.to, data: this.data, ...options });
    } catch (e) {
      throw errorCoder.decodeError(e);
    }
  }

  /**
   * Executes a message call transaction,
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: Can not alter the smart contract state.
   *
   * @param options {object} - See [format.callTx](#util/format.js/callTx)
   * @param epochNumber {string|number} - See [Conflux.call](#Conflux.js/call)
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    try {
      const hex = await this.cfx.call({ to: this.to, data: this.data, ...options }, epochNumber);
      return this.method.decodeOutputs(hex);
    } catch (e) {
      throw errorCoder.decodeError(e);
    }
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

class ContractMethod extends FunctionCoder {
  constructor(cfx, contract, fragment) {
    super(fragment);
    this.cfx = cfx;
    this.contract = contract;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const to = this.contract.address;
    const data = this.encodeData(args);
    return new Called(this.cfx, this, { to, data });
  }

  decodeData(hex) {
    const namedTuple = super.decodeData(hex);
    return {
      name: this.name,
      fullName: this.fullName,
      type: this.type,
      signature: this.signature,
      array: [...namedTuple],
      object: namedTuple.toObject(),
    };
  }
}

/**
 * @memberOf ContractMethod
 */
class ContractMethodOverride {
  constructor(cfx, contract, methods) {
    this.cfx = cfx;
    this.contract = contract;
    this.signatureToMethod = lodash.keyBy(methods, 'signature');

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];

    let called;
    for (const method of Object.values(this.signatureToMethod)) {
      try {
        called = method(...args);
        acceptArray.push(method.type);
      } catch (e) {
        rejectArray.push(method.type);
      }
    }

    if (!acceptArray.length) {
      throw new Error(`can not match override "${rejectArray.join('|')}" with args (${args.join(',')})`);
    }
    if (acceptArray.length > 1) {
      throw new Error(`can not determine override "${acceptArray.join('|')}" with args (${args.join(',')})`);
    }

    return called;
  }

  decodeData(hex) {
    const signature = hex.slice(0, 10); // '0x' + 8 hex
    const method = this.signatureToMethod[signature];
    return method.decodeData(hex);
  }
}

module.exports = ContractMethod;
module.exports.ContractMethodOverride = ContractMethodOverride;
module.exports.Called = Called;
