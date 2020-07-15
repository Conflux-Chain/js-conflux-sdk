const callable = require('../util/callable');
const EventCoder = require('./EventCoder');

/**
 * @memberOf ContractEvent
 */
class LogFilter {
  constructor({ address, topics }, event) {
    this.address = address;
    this.topics = topics;
    Reflect.defineProperty(this, 'event', { value: event }); // avoid for JSON.stringify
  }

  async getLogs(options = {}) {
    const logs = await this.event.conflux.getLogs({ ...options, address: this.address, topics: this.topics });

    logs.forEach(log => {
      log.params = this.event.decodeLog(log);
    });

    return logs;
  }
}

class ContractEvent extends EventCoder {
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

  decodeLog(log) {
    const namedTuple = super.decodeLog(log);
    return {
      name: this.name,
      fullName: this.fullName,
      type: this.type,
      signature: this.signature,
      array: [...namedTuple],
      object: namedTuple.toObject(),
    };
  }
}

module.exports = ContractEvent;
module.exports.LogFilter = LogFilter;
