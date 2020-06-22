const lodash = require('lodash');
const { decorate } = require('../util');
const { EventCoder } = require('../abi');
const callable = require('../lib/callable');

/**
 * @memberOf ContractEvent
 */
class EventLog {
  constructor(cfx, event, { address, topics }) {
    this.cfx = cfx;
    this.event = event;
    this.address = address;
    this.topics = topics;
  }

  getLogs(options = {}) {
    const _decodeLog = log => {
      if (log !== undefined) {
        log.params = this.event.decodeLog(log);
      }
      return log;
    };

    // new LogIterator and decorate for decode params
    const iter = this.cfx.getLogs({
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

class ContractEvent extends EventCoder {
  constructor(cfx, contract, fragment) {
    super(fragment);
    this.cfx = cfx;
    this.contract = contract;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const address = this.contract.address;
    const topics = [this.signature, ...this.encodeTopics(args)];
    return new EventLog(this.cfx, this, { address, topics });
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

/**
 * @memberOf ContractEvent
 */
class ContractEventOverride {
  constructor(cfx, contract, events) {
    this.cfx = cfx;
    this.contract = contract;

    this.signatureToEvent = lodash.keyBy(events, 'signature');

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];
    for (const event of Object.values(this.signatureToEvent)) {
      try {
        acceptArray.push(event(...args).topics);
      } catch (e) {
        rejectArray.push(event.type);
      }
    }

    if (!acceptArray.length) {
      throw new Error(`can not match override "${rejectArray.join(',')}" with args (${args.join(',')})`);
    }

    // transpose acceptArray
    const topics = lodash.zip(...acceptArray).map(array => {
      array = array.filter(Boolean);
      return array.length ? array : null;
    });

    return new EventLog(this.cfx, this, { address: this.contract.address, topics });
  }

  decodeLog(log) {
    const topic = log.topics[0];
    const event = this.signatureToEvent[topic];
    return event.decodeLog(log);
  }
}

module.exports = ContractEvent;
module.exports.ContractEventOverride = ContractEventOverride;
module.exports.EventLog = EventLog;
