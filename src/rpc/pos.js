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
    forfeited: format.uInt,
    forceRetired: format.uInt.$or(null),
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

/**
 * PoS RPC Class
 */
class PoS extends RPCMethodFactory {
  /**
   * Create PoS instance
   * @param {Conflux} conflux - The Conflux object
   * @return {PoS} The PoS instance
   */
  constructor(conflux) {
    super(conflux, PoS.methods());
    this.conflux = conflux;
  }

  static methods() {
    return [
      /**
       * @func
       * @async
       * @name getStatus
       * @return {Promise<Object>} PoS status object
       */
      {
        method: 'pos_getStatus',
        responseFormatter: format.posStatus,
      },
      /**
       * @func
       * @async
       * @name getAccount
       * @param {Hash} account - Account address
       * @param {BlockNumber} [blockNumber] - Optional block number
       * @return {Promise<Object>}
       */
      {
        method: 'pos_getAccount',
        requestFormatters: [
          format.hex64,
          format.posBlockNumber.$or(undefined),
        ],
        responseFormatter: format.posAccount,
      },
      /**
       * @func
       * @async
       * @name getBlockByHash
       * @param {Hash} hash - The hash of PoS block
       * @return {Promise<Object>}
       */
      {
        method: 'pos_getBlockByHash',
        requestFormatters: [
          format.hex64,
        ],
        responseFormatter: format.posBlock,
      },
      /**
       * @func
       * @async
       * @name getBlockByNumber
       * @param {BlockNumber} blockNumber - The number of PoS block
       * @return {Promise<Object>}
       */
      {
        method: 'pos_getBlockByNumber',
        requestFormatters: [
          format.posBlockNumber,
        ],
        responseFormatter: format.posBlock,
      },
      /**
       * @func
       * @async
       * @name getCommittee
       * @param {BlockNumber} [blockNumber] - Optional block number
       * @return {Promise<Object>}
       */
      {
        method: 'pos_getCommittee',
        requestFormatters: [
          format.posBlockNumber.$or(undefined),
        ],
        responseFormatter: format.committee,
      },
      /**
       * @func
       * @async
       * @name getTransactionByNumber
       * @param {TransactionNumber} txNumber - The number of transaction
       * @return {Promise<Object>}
       */
      {
        method: 'pos_getTransactionByNumber',
        requestFormatters: [
          format.bigUIntHex,
        ],
        responseFormatter: format.posTransaction,
      },
      /**
       * @func
       * @async
       * @name getRewardsByEpoch
       * @param {Epoch} epoch - A PoS epoch number
       * @return {Promise<Object>}
       */
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
