const lodash = require('lodash');
const callable = require('../../util/callable');

class ContractMethodOverride {
  constructor(methods, contract, conflux) {
    this.signatureToMethod = lodash.keyBy(methods, 'signature');
    this.contract = contract;
    this.conflux = conflux;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];

    let transaction;
    for (const method of Object.values(this.signatureToMethod)) {
      try {
        transaction = method(...args);
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

    return transaction;
  }

  decodeData(hex) {
    const signature = hex.slice(0, 10); // '0x' + 8 hex
    const method = this.signatureToMethod[signature];
    return method.decodeData(hex);
  }
}

module.exports = ContractMethodOverride;
