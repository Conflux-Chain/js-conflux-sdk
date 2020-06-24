class ContractABICoder {
  constructor(contract) {
    this.contract = contract;
  }

  decodeData(data) {
    const method = this.contract[data.slice(0, 10)];
    if (method) {
      return method.decodeData(data);
    } else if (data.startsWith(this.contract.constructor.bytecode)) {
      return this.contract.constructor.decodeData(data);
    }
    return undefined;
  }

  decodeLog(log) {
    const event = this.contract[log.topics[0]];
    if (event) {
      return event.decodeLog(log);
    }
    return undefined;
  }
}

module.exports = ContractABICoder;
