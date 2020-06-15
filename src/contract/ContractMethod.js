const lodash = require('lodash');
const { assert } = require('../util');
const { FunctionCoder, errorCoder } = require('../abi');
const callable = require('../lib/callable');

/**
 * @memberOf ContractMethod
 */
class Called {
  constructor(cfx, coder, { to, data }) {
    this.cfx = cfx;
    this.coder = coder;
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
   * @param options {object} - See `format.estimateTx`
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
   * @param options {object} - See `format.callTx`.
   * @param epochNumber {string|number} - See `Conflux.call`.
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    try {
      const hex = await this.cfx.call({ to: this.to, data: this.data, ...options }, epochNumber);
      const namedTuple = this.coder.decodeOutputs(hex);
      return namedTuple.length <= 1 ? namedTuple[0] : namedTuple;
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

class ContractMethod {
  constructor(cfx, contract, fragment) {
    this.cfx = cfx;
    this.contract = contract;

    this.coder = new FunctionCoder(fragment);
    this.name = fragment.name; // example: "add"
    this.type = this.coder.type; // example: "add(uint,uint)"
    this.signature = this.coder.signature(); // example: "0xb8966352"
    this.bytecode = this.signature; // example: "0xb8966352"

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    if (!this.bytecode) {
      throw new Error('bytecode is empty');
    }

    const to = this.contract.address;
    const data = `${this.bytecode}${this.coder.encodeInputs(args).substring(2)}`;
    return new Called(this.cfx, this.coder, { to, data });
  }

  decodeData(hex) {
    const prefix = hex.slice(0, this.bytecode.length);
    const data = hex.slice(this.bytecode.length);

    assert(prefix === this.bytecode, {
      message: 'decodeData unexpected bytecode',
      expect: this.bytecode,
      got: prefix,
      coder: this.coder,
    });

    const namedTuple = this.coder.decodeInputs(data);
    return {
      name: this.name,
      fullName: this.coder.fullName,
      type: this.coder.type,
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
