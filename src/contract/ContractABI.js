class ContractABI {
  constructor(contract) {
    this.contract = contract;
  }

  decodeData(data) {
    const method = this.contract[data.slice(0, 10)] || this.contract.constructor;

    const tuple = method.decodeData(data);
    if (!tuple) {
      return undefined;
    }

    return {
      name: method.name,
      fullName: method.fullName,
      type: method.type,
      signature: method.signature,
      array: [...tuple],
      object: tuple.toObject(),
    };
  }

  decodeLog(log) {
    const event = this.contract[log.topics[0]];
    if (!event) {
      return undefined;
    }

    const tuple = event.decodeLog(log);
    return {
      name: event.name,
      fullName: event.fullName,
      type: event.type,
      signature: event.signature,
      array: [...tuple],
      object: tuple.toObject(),
    };
  }
}

module.exports = ContractABI;
