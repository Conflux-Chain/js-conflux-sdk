const format = require('../util/format');

const LATEST_COMMITTED = 'latest_committed';
const LATEST_VOTED = 'latest_voted';

format.posBlockNumber = format.bigUIntHex
  .$or(LATEST_COMMITTED)
  .$or(LATEST_VOTED);

format.posStatus = format({
  blockNumber: format.uInt,
  epoch: format.uInt,
  pivotDecision: format.uInt,
});

format.posAccount = format({
  blockNumber: format.uInt,
  status: {
    availableVotes: format.uInt,
    exemptFromForfeit: format.uInt.$or(null),
    forceRetired: false,
    inQueue: format.uInt,
    locked: format.uInt,
    outQueue: format.uInt,
    unlocked: format.uInt,
  },
});

format.posBlock = format({
  epoch: format.uInt,
  height: format.uInt,
  pivotDecision: format.uInt,
  round: format.uInt,
  timestamp: format.uInt,
  version: format.uInt,
}).$or(null);

format.committeeNode = format({
  votingPower: format.uInt,
});

format.election = format({
  startView: format.uInt,
  topElectingNodes: [format.committeeNode],
});

format.committee = format({
  currentCommittee: {
    epochNumber: format.uInt,
    nodes: [format.committeeNode],
  },
  elections: [format.election],
});

class PoS {
  constructor(provider) {
    this.provider = provider;
  }

  async getStatus() {
    const status = await this.provider.call('pos_getStatus');
    return format.posStatus(status);
  }

  async getAccount(address, blockNumber) {
    const account = await this.provider.call('pos_getAccount', format.hex64(address), format.posBlockNumber.$or(undefined)(blockNumber));
    return format.posAccount(account);
  }

  async getBlockByHash(hash) {
    const block = await this.provider.call('pos_getBlockByHash', format.hex64(hash));
    return format.posBlock(block);
  }

  async getBlockByNumber(blockNumber) {
    const block = await this.provider.call('pos_getBlockByNumber', format.posBlockNumber(blockNumber));
    return format.posBlock(block);
  }

  async getCommittee(blockNumber) {
    const block = await this.provider.call('pos_getCommittee', format.posBlockNumber.$or(undefined)(blockNumber));
    return format.committee(block);
  }
}

module.exports = PoS;
