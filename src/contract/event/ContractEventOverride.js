const lodash = require('lodash');
const callable = require('../../util/callable');

class ContractEventOverride {
  constructor(events, contract, conflux) {
    this.signatureToEvent = lodash.keyBy(events, 'signature');
    this.contract = contract;
    this.conflux = conflux;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];

    let filter;
    for (const event of Object.values(this.signatureToEvent)) {
      try {
        filter = event(...args);
        acceptArray.push(event.type);
      } catch (e) {
        rejectArray.push(event.type);
      }
    }

    if (!acceptArray.length) {
      throw new Error(`can not match override "${rejectArray.join(',')}" with args (${args.join(',')})`);
    }
    if (acceptArray.length > 1) {
      throw new Error(`can not determine override "${acceptArray.join('|')}" with args (${args.join(',')})`);
    }

    return filter;
  }

  decodeLog(log) {
    const topic = log.topics[0];
    const event = this.signatureToEvent[topic];
    return event.decodeLog(log);
  }
}

module.exports = ContractEventOverride;
