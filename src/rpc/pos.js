const RPCMethodFactory = require('./index');
const format = require('../util/format');

const LATEST_COMMITTED = 'latest_committed';
const LATEST_VOTED = 'latest_voted';

format.posBlockNumber = format.bigUIntHex
  .$or(LATEST_COMMITTED)
  .$or(LATEST_VOTED);

/**
 * @typedef {Object} PivotDecision
 * @property {number} height
 * @property {hex} blockHash
 */
format.decision = format({
  height: format.uInt,
});

/**
 * PoS status
 * @typedef {Object} PoSStatus
 * @property {number} latestCommitted
 * @property {epoch}
 * @property {latestVoted}
 * @property {PivotDecision}
 */
format.posStatus = format({
  latestCommitted: format.uInt,
  epoch: format.uInt,
  pivotDecision: format.decision,
  latestVoted: format.uInt.$or(null),
});

/**
 * @typedef {Object} VotePowerState
 * @property {number} endBlockNumber
 * @property {number} power
 */
format.posVotePowerState = format({
  endBlockNumber: format.uInt,
  power: format.uInt,
});

/**
 * @typedef {Object} PoSAccountStatus
 * @typedef {number} availableVotes
 * @typedef {number} forfeited
 * @typedef {VotePowerState[]} inQueue
 * @typedef {VotePowerState[]} outQueue
 * @typedef {number} locked
 * @typedef {number} unlocked
 * @typedef {number|null} forceRetired
 */

/**
 * @typedef {Object} PoSAccount
 * @property {number} blockNumber
 * @property {PoSAccountStatus} status
 */
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

format.txPayload = format({
  targetTerm: format.uInt,
}).$or({
  votingPower: format.uInt,
}).$or({
  height: format.uInt,
});

/**
 * @typedef {Object} PoSTransaction
 * @property {string} hash
 * @property {string} blockHash
 * @property {string} from
 * @property {string} status
 * @property {string} type
 * @property {number} number
 * @property {number|null} timestamp
 * @property {number|null} blockNumber
 * @property {*} payload
 */
format.posTransaction = format({
  number: format.uInt,
  timestamp: format.uInt.$or(null),
  blockNumber: format.uInt.$or(null),
  payload: format.txPayload.$or(null),
}).$or(null);

/**
 * @typedef {Object} Signature
 * @property {number} votes
 * @property {hash} account
 */

/**
 * @typedef {Object} PoSBlock
 * @property {number} epoch
 * @property {number} height
 * @property {PivotDecision} pivotDecision
 * @property {number} round
 * @property {number} timestamp
 * @property {number} nextTxNumber
 * @property {Signature} signatures
 */
format.posBlock = format({
  epoch: format.uInt,
  height: format.uInt,
  pivotDecision: format.decision.$or(null),
  round: format.uInt,
  timestamp: format.uInt,
  nextTxNumber: format.uInt,
  signatures: [format({ votes: format.uInt })],
}).$or(null);

/**
 * @typedef {Object} CommitteeNode
 * @property {number} votingPower
 * @property {hash} address
 */
format.committeeNode = format({
  votingPower: format.uInt,
});

/**
 * @typedef {Object} Election
 * @property {number} startBlockNumber
 * @property {CommitteeNode[]} topElectingNodes
 */
format.election = format({
  startBlockNumber: format.uInt,
  topElectingNodes: [format.committeeNode],
});

/**
 * @typedef {Object} CurrentCommittee
 * @property {number} epochNumber
 * @property {number} quorumVotingPower
 * @property {number} totalVotingPower
 * @property {CommitteeNode[]} nodes
 */

/**
 * @typedef {Object} PoSCommittee
 * @property {CurrentCommittee} currentCommittee
 * @property {Election[]} elections
 */
format.committee = format({
  currentCommittee: {
    epochNumber: format.uInt,
    quorumVotingPower: format.uInt,
    totalVotingPower: format.uInt,
    nodes: [format.committeeNode],
  },
  elections: [format.election],
});

/**
 * @typedef {Object} PoSReward
 * @property {number} reward
 * @property {hash} posAddress
 * @property {string} powAddress
 */

/**
 * @typedef {Object} PoSEpochRewards
 * @property {hash} powEpochHash
 * @property {PoSReward[]} accountRewards
 */
format.rewardsByEpoch = format({
  accountRewards: [format({
    reward: format.bigUInt,
  })],
}).$or(null);

/**
 * Class contains pos RPC methods
 * @class
 */
class PoS extends RPCMethodFactory {
  /**
   * Create PoS instance
   * @param {object} conflux - The Conflux object
   * @return {object} The PoS instance
   */
  constructor(conflux) {
    super(conflux, PoS.methods());
    this.conflux = conflux;
  }

  static methods() {
    return [
      /**
       * @instance
       * @async
       * @name getStatus
       * @return {Promise<PoSStatus>} PoS status object
       */
      {
        method: 'pos_getStatus',
        responseFormatter: format.posStatus,
      },
      /**
       * @instance
       * @async
       * @name getAccount
       * @param {Hash} account - Account address
       * @param {number|hex} [blockNumber] - Optional block number
       * @return {Promise<PoSAccount>}
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
       * @instance
       * @async
       * @name getBlockByHash
       * @param {Hash} hash - The hash of PoS block
       * @return {Promise<PoSBlock>}
       */
      {
        method: 'pos_getBlockByHash',
        requestFormatters: [
          format.hex64,
        ],
        responseFormatter: format.posBlock,
      },
      /**
       * @instance
       * @async
       * @name getBlockByNumber
       * @param {number|hex} blockNumber - The number of PoS block
       * @return {Promise<PoSBlock>}
       */
      {
        method: 'pos_getBlockByNumber',
        requestFormatters: [
          format.posBlockNumber,
        ],
        responseFormatter: format.posBlock,
      },
      /**
       * @instance
       * @async
       * @name getCommittee
       * @param {number|hex} [blockNumber] - Optional block number
       * @return {Promise<PoSCommittee>}
       */
      {
        method: 'pos_getCommittee',
        requestFormatters: [
          format.posBlockNumber.$or(undefined),
        ],
        responseFormatter: format.committee,
      },
      /**
       * @instance
       * @async
       * @name getTransactionByNumber
       * @param {number|hex} txNumber The number of transaction
       * @return {Promise<PoSTransaction>}
       */
      {
        method: 'pos_getTransactionByNumber',
        requestFormatters: [
          format.bigUIntHex,
        ],
        responseFormatter: format.posTransaction,
      },
      /**
       * @instance
       * @async
       * @name getRewardsByEpoch
       * @param {number|hex} epoch A PoS epoch number
       * @return {Promise<PoSEpochRewards>}
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
