import callable from '../../util/callable.js';
import MethodTransaction from './MethodTransaction.js';
import FunctionCoder from './FunctionCoder.js';

export default class ContractMethod extends FunctionCoder {
  constructor(fragment, contract, conflux) {
    super(fragment);
    this.contract = contract;
    this.conflux = conflux;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const to = this.contract.address; // dynamic get `contract.address`
    const data = this.encodeData(args);
    return new MethodTransaction({ to, data }, this);
  }
}
