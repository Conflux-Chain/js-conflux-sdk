const lodash = require('lodash');
const ContractMethod = require('./ContractMethod');

class ContractConstructor extends ContractMethod {
  constructor(cfx, contract, fragment, bytecode) {
    super(cfx, contract, lodash.defaults(fragment, { name: 'constructor', inputs: [] }));

    this.bytecode = bytecode;
    this.coder.decodeOutputs = hex => hex;
  }
}

module.exports = ContractConstructor;
