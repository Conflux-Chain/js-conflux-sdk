import lodash from 'lodash';
import ContractConstructor from './ContractConstructor';
import ContractMethod from './ContractMethod';
import ContractEvent from './ContractEvent';

export default class ContractABICoder {
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
    const _function = this._codeToInstance[data.slice(0, 10)]; // contract function code match '0x[0~9a-z]{8}'
    if (_function) {
      const name = _function.name;
      const params = _function.decodeData(data); // skip contract function code prefix
      return { name, params };
    }

    const _constructor = this._constructorFunction;
    if (_constructor && data.startsWith(_constructor.bytecode)) {
      const name = _constructor.name;
      const params = _constructor.decodeData(data);
      return { name, params };
    }

    return undefined;
  }

  decodeLog(log) {
    const _event = this._codeToInstance[log.topics[0]];
    if (_event) {
      const name = _event.name;
      const params = _event.decodeLog(log);
      return { name, params };
    }

    return undefined;
  }
}
