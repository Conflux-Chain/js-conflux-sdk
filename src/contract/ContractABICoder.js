const ContractConstructor = require('./ContractConstructor');
const ContractFunction = require('./ContractFunction');
const ContractEvent = require('./ContractEvent');

class ContractABICoder {
  constructor(contract) {
    this._constructorFunction = null;
    this._codeToFunction = {};
    this._codeToEvent = {};

    Object.values(contract).forEach(instance => {
      if (!instance || !instance.constructor) {
        // pass
      } else if (instance.constructor === ContractConstructor) {
        this._constructorFunction = instance;
      } else if (instance.constructor === ContractFunction) {
        this._codeToFunction[instance.code] = instance;
      } else if (instance.constructor === ContractEvent) {
        this._codeToEvent[instance.code] = instance;
      }
    });
  }

  decodeData(data) {
    const _function = this._codeToFunction[data.slice(0, 10)]; // contract function code match '0x[0~9a-z]{8}'
    if (_function) {
      return { name: _function.fragment.name, params: _function.params(data) };
    }

    const _constructor = this._constructorFunction;
    if (_constructor && data.startsWith(_constructor.code)) {
      return { name: _constructor.fragment.type, params: _constructor.params(data) };
    }

    return undefined;
  }

  decodeLog(log) {
    const event = this._codeToEvent[log.topics[0]];
    if (!event) {
      return undefined;
    }

    return { name: event.fragment.name, params: event.params(log) };
  }
}

module.exports = ContractABICoder;
