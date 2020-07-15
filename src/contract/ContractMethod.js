const callable = require('../util/callable');
const FunctionCoder = require('./FunctionCoder');
const Transaction = require('../Transaction');

/**
 * @memberOf ContractMethod
 */
class MethodTransaction extends Transaction {
  constructor(options, method) {
    super(options);
    Reflect.defineProperty(this, 'method', { value: method }); // avoid for JSON.stringify
  }

  options(options = {}) {
    return new this.constructor({ to: this.to, data: this.data, ...options }, this.method);
  }

  async then(resolve, reject) {
    try {
      const hex = await this.method.conflux.call(this);
      const result = this.method.decodeOutputs(hex);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }
}

class ContractMethod extends FunctionCoder {
  constructor(fragment, contract, conflux) {
    super(fragment);
    this.contract = contract;
    this.conflux = conflux;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const to = this.contract.address; // dynamic get `contract.address`
    const data = this.encodeData(args);
    return new MethodTransaction({ to, data }, this);
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

module.exports = ContractMethod;
module.exports.MethodTransaction = MethodTransaction;
