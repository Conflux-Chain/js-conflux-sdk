const lodash = require('lodash');
const ContractMethod = require('./ContractMethod');

class ContractConstructor extends ContractMethod {
  constructor(cfx, contract, fragment, bytecode) {
    super(cfx, contract, lodash.defaults(fragment, { name: 'constructor', inputs: [] }));

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

    return super.call(...args);
  }
}

module.exports = ContractConstructor;
