const RPCMethodFactory = require('./index');
const format = require('../util/format');

const LATEST_COMMITTED = 'latest_committed';
const LATEST_VOTED = 'latest_voted';

format.posBlockNumber = format.bigUIntHex
  .$or(LATEST_COMMITTED)
  .$or(LATEST_VOTED);

format.posStatus = format({
  latestCommitted: format.uInt,
  epoch: format.uInt,
  pivotDecision: format.uInt,
  latestVoted: format.uInt.$or(null),
});

format.posVotePowerState = format({
  endBlockNumber: format.uInt,
  power: format.uInt,
});

format.posAccount = format({
  blockNumber: format.uInt,
  status: {
    availableVotes: format.uInt,
    exemptFromForfeit: format.uInt.$or(null),
    forceRetired: false,
    inQueue: [format.posVotePowerState],
    locked: format.uInt,
    outQueue: [format.posVotePowerState],
    unlocked: format.uInt,
  },
});

format.posTransaction = format({
  number: format.uInt,
  timestamp: format.uInt.$or(null),
  blockNumber: format.uInt.$or(null),
}).$or(null);

format.posBlock = format({
  epoch: format.uInt,
  height: format.uInt,
  pivotDecision: format.uInt,
  round: format.uInt,
  timestamp: format.uInt,
  nextTxNumber: format.uInt,
  signatures: [format({ votes: format.uInt })],
}).$or(null);

format.committeeNode = format({
  votingPower: format.uInt,
});

format.election = format({
  startBlockNumber: format.uInt,
  topElectingNodes: [format.committeeNode],
});

format.committee = format({
  currentCommittee: {
    epochNumber: format.uInt,
    quorumVotingPower: format.uInt,
    totalVotingPower: format.uInt,
    nodes: [format.committeeNode],
  },
  elections: [format.election],
});

format.rewardsByEpoch = format({
  accountRewards: [format({
    reward: format.bigUInt,
  })],
}).$or(null);

class PoS extends RPCMethodFactory {
  constructor(provider) {
    super(provider, PoS.methods());
    this.provider = provider;
  }

  static methods() {
    return [
      {
        method: 'pos_getStatus',
        requestFormatters: [],
        responseFormatter: format.posStatus,
      },
      {
        method: 'pos_getAccount',
        requestFormatters: [
          format.hex64,
          format.posBlockNumber.$or(undefined),
        ],
        responseFormatter: format.posAccount,
      },
      {
        method: 'pos_getBlockByHash',
        requestFormatters: [
          format.hex64,
        ],
        responseFormatter: format.posBlock,
      },
      {
        method: 'pos_getBlockByNumber',
        requestFormatters: [
          format.posBlockNumber,
        ],
        responseFormatter: format.posBlock,
      },
      {
        method: 'pos_getCommittee',
        requestFormatters: [
          format.posBlockNumber.$or(undefined),
        ],
        responseFormatter: format.committee,
      },
      {
        method: 'pos_getTransactionByNumber',
        requestFormatters: [
          format.bigUIntHex,
        ],
        responseFormatter: format.posTransaction,
      },
      {
        method: 'pos_getRewardsByEpoch',
        requestFormatters: [
          format.bigUIntHex,
        ],
        responseFormatter: format.rewardsByEpoch,
      },
    ];
  }
}

module.exports = PoS;
