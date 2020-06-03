const lodash = require('lodash');
const ContractConstructor = require('./ContractConstructor');
const ContractMethod = require('./ContractMethod');
const ContractEvent = require('./ContractEvent');

class ContractABICoder {
  constructor(contract) {
    this._constructorFunction = null;
    this._codeToInstance = {};

    lodash.forEach(contract, instance => {
      switch (instance.constructor) {
        case ContractConstructor:
          this._constructorFunction = instance;
          break;

        case ContractMethod:
        case ContractEvent:
          Object.keys(instance.signatureToCoder).forEach(signature => {
            this._codeToInstance[signature] = instance;
          });
          break;

        default:
          break;
      }
    });
  }

  decodeData(data) {
    const _method = this._codeToInstance[data.slice(0, 10)]; // contract function code match '0x[0~9a-z]{8}'
    if (_method) {
      return _method.decodeData(data);
    }

    const _constructor = this._constructorFunction;
    if (_constructor && data.startsWith(_constructor.bytecode)) {
      return _constructor.decodeData(data);
    }

    return undefined;
  }

  decodeLog(log) {
    const _event = this._codeToInstance[log.topics[0]];
    if (_event) {
      return _event.decodeLog(log);
    }

    return undefined;
  }
}

module.exports = ContractABICoder;
