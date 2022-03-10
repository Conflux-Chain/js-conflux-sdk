import callable from '../../util/callable.js';
import EventCoder from './EventCoder.js';
import LogFilter from './LogFilter.js';

export default class ContractEvent extends EventCoder {
  constructor(fragment, contract, conflux) {
    super(fragment);
    this.contract = contract;
    this.conflux = conflux;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const address = this.contract.address; // dynamic get `contract.address`
    const topics = [this.signature, ...this.encodeTopics(args)];
    return new LogFilter({ address, topics }, this);
  }
}
