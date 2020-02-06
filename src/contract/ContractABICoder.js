import lodash from 'lodash';
import ContractConstructor from './ContractConstructor';
import ContractFunction from './ContractFunction';
import ContractEvent from './ContractEvent';

export default class ContractABICoder {
  constructor(contract) {
    this._constructorFunction = null;
    this._codeToFunction = {};
    this._codeToEvent = {};

    lodash.forEach(contract, (instance, name) => {
      if (instance.constructor === ContractConstructor) {
        this._constructorFunction = instance;
      } else if (instance.constructor === ContractFunction) {
        this._codeToFunction[instance.code] = instance;
      } else if (instance.constructor === ContractEvent) {
        this._codeToEvent[instance.code] = instance;
      } else {
        throw new Error(`unexpected type of "${name}", got ${instance}`);
      }
    });
  }

  decodeData(data) {
    const _function = this._codeToFunction[data.slice(0, 10)]; // contract function code match '0x[0~9a-z]{8}'
    if (_function) {
      const name = _function.fragment.name;
      const params = _function.coder.decodeInputs(data.slice(10)); // skip contract function code prefix
      return { name, params };
    }

    const _constructor = this._constructorFunction;
    if (_constructor && data.startsWith(_constructor.code)) {
      const name = _constructor.fragment.type;
      const params = _constructor.coder.decodeInputs(data.slice(_constructor.code.length)); // skip prefix

      return { name, params };
    }

    return undefined;
  }

  decodeLog(log) {
    const event = this._codeToEvent[log.topics[0]];
    if (event) {
      const name = event.fragment.name;
      const params = event.decode(log);

      return { name, params };
    }

    return undefined;
  }
}
