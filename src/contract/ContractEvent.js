import callable from '../lib/callable';
import { decorate } from '../util';
import { EventCoder } from '../abi';

class EventLog {
  constructor(cfx, eventLog, { address, topics }) {
    this.cfx = cfx;
    this.eventLog = eventLog;
    this.address = address;
    this.topics = topics;
  }

  getLogs(options = {}) {
    const _decodeLog = log => {
      if (log !== undefined) {
        log.params = this.eventLog.decode(log);
      }
      return log;
    };

    // new LogIterator and decorate for decode params
    const iter = this.eventLog.cfx.getLogs({
      ...options,
      address: this.address,
      topics: this.topics,
    });

    decorate(iter, 'next', async (func, args) => {
      return _decodeLog(await func(...args));
    });

    decorate(iter, 'then', (func, [resolve, reject]) => {
      return func(logs => resolve(logs.map(_decodeLog)), reject);
    });

    return iter;
  }
}

export default class ContractEvent {
  constructor(cfx, contract, fragment) {
    this.cfx = cfx;
    this.contract = contract;
    this.fragment = fragment;

    this.coder = new EventCoder(this.fragment);
    this.code = this.coder.signature();

    return callable(this, this.call.bind(this));
  }

  call(...params) {
    return new EventLog(this.cfx, this, {
      address: this.contract.address,
      topics: this.encode(params),
    });
  }

  encode(params) {
    const topics = this.coder.encodeTopics(params);

    return this.fragment.anonymous ? topics : [this.code, ...topics];
  }

  decode(log) {
    return this.coder.decodeLog(log);
  }
}
