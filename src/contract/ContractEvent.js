const { decorate } = require('../utils');
const { EventCoder } = require('../abi');

class EventLog {
  constructor(cfx, eventLog, { address, topics }) {
    this.cfx = cfx;
    this.eventLog = eventLog;
    this.address = address;
    this.topics = topics;
  }

  getLogs(options) {
    const iter = this.eventLog.cfx.getLogs({
      ...options,
      address: this.address,
      topics: this.topics,
    });

    decorate(iter, 'next', async (func, params) => {
      const log = await func(...params);
      if (log) {
        log.params = this.eventLog.params(log);
      }
      return log;
    });

    return iter;
  }
}

class ContractEvent {
  constructor(cfx, contract, fragment) {
    this.cfx = cfx;
    this.contract = contract;
    this.fragment = fragment;

    this.coder = new EventCoder(this.fragment);
    this.code = this.coder.signature();

    return new Proxy(this.call.bind(this), {
      get: (_, key) => this[key],
    });
  }

  call(...params) {
    Object.entries(params).forEach(([index, param]) => {
      if (param !== undefined) {
        params[index] = this.coder.encodeInputByIndex(param, index);
      }
    });

    return new EventLog(this.cfx, this, {
      address: this.contract.address,
      topics: [this.code, ...params],
    });
  }

  params(log) {
    if (this.code !== log.topics[0]) {
      return undefined;
    }
    return this.coder.decodeLog(log);
  }
}

module.exports = ContractEvent;
