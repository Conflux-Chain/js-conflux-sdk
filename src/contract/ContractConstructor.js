const { Hex } = require('../utils/type');
const ContractFunction = require('./ContractFunction');

class ContractConstructor extends ContractFunction {
  encode(params) {
    if (!this.code) {
      throw new Error('contract.constructor.code is empty');
    }
    return Hex.concat(this.code, this.coder.encodeInputs(params));
  }

  decode(hex) {
    return hex;
  }
}

module.exports = ContractConstructor;
