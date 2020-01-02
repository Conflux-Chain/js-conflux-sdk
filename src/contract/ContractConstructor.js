const ContractFunction = require('./ContractFunction');

class ContractConstructor extends ContractFunction {
  encode(params) {
    if (!this.code) {
      throw new Error('contract.constructor.code is empty');
    }
    const hex = this.coder.encodeInputs(params);
    return `${this.code}${hex.substring(2)}`;
  }

  decode(hex) {
    return hex;
  }
}

module.exports = ContractConstructor;
