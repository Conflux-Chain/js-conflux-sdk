const lodash = require('lodash');
const ContractMethod = require('./ContractMethod');
const { WORD_CHARS } = require('../../CONST');

class ContractConstructor extends ContractMethod {
  constructor(fragment, bytecode, contract, conflux) {
    super(lodash.defaults(fragment, { name: 'constructor', inputs: [] }), contract, conflux);

    this.signature = ''; // MUST be '' for `super.encodeData`
    this.bytecode = bytecode;
    this.decodeOutputs = hex => hex;
  }

  call(...args) {
    if (!this.bytecode) {
      throw new Error('bytecode is empty');
    }

    const transaction = super.call(...args);
    transaction.to = null;
    return transaction;
  }

  /**
   * Encode contract deploy data
   *
   * @param {array} args
   * @return {string}
   */
  encodeData(args) {
    return `${this.bytecode}${super.encodeData(args)}`;
  }

  /**
   * Reverse try to decode word by word
   *
   * @param {string} hex - Hex string
   * @return {array} NamedTuple
   */
  decodeData(hex) {
    for (let index = WORD_CHARS; index <= hex.length; index += WORD_CHARS) {
      try {
        return super.decodeData(hex.slice(-index));
      } catch (e) {
        // pass
      }
    }
    return undefined;
  }
}

module.exports = ContractConstructor;
