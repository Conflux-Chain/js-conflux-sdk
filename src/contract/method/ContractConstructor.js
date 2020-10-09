const lodash = require('lodash');
const ContractMethod = require('./ContractMethod');

class ContractConstructor extends ContractMethod {
  constructor(fragment, bytecode, contract, conflux) {
    super(lodash.defaults(fragment, { name: 'constructor', inputs: [] }), contract, conflux);

    this.bytecode = bytecode;
    this.decodeOutputs = hex => hex;
  }

  get signature() {
    return this.bytecode;
  }

  set signature(hex) {
    this.bytecode = hex;
  }

  call(...args) {
    if (!this.bytecode) {
      throw new Error('bytecode is empty');
    }

    const transaction = super.call(...args);
    transaction.to = null;
    return transaction;
  }
}

module.exports = ContractConstructor;
