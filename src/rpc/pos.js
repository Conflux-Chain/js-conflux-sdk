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
 * @property {string} blockHash
 */
format.decision = format({
  height: format.uInt,
});

/**
 * PoS status
 * @typedef {Object} PoSStatus
 * @property {number} latestCommitted
 * @property {number} epoch
 * @property {number} latestVoted
 * @property {number} latestTxNumber
 * @property {PivotDecision} pivotDecision
 */
format.posStatus = format({
  latestCommitted: format.uInt,
  epoch: format.uInt,
  pivotDecision: format.decision,
  latestTxNumber: format.uInt,
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
 * @property {number} availableVotes
 * @property {number} forfeited
 * @property {VotePowerState[]} inQueue
 * @property {VotePowerState[]} outQueue
 * @property {number} locked
 * @property {number} unlocked
 * @property {number|null} forceRetired
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
 * @property {string} account
 */

/**
 * @typedef {Object} PoSBlock
 * @property {number} epoch
 * @property {number} height
 * @property {PivotDecision} pivotDecision
 * @property {number} round
 * @property {number} timestamp
 * @property {number} lastTxNumber
 * @property {Signature} signatures
 */
format.posBlock = format({
  epoch: format.uInt,
  height: format.uInt,
  pivotDecision: format.decision.$or(null),
  round: format.uInt,
  timestamp: format.uInt,
  lastTxNumber: format.uInt,
  signatures: [format({ votes: format.uInt })],
}).$or(null);

/**
 * @typedef {Object} CommitteeNode
 * @property {number} votingPower
 * @property {string} address
 */
format.committeeNode = format({
  votingPower: format.uInt,
});

/**
 * @typedef {Object} Election
 * @property {boolean} isFinalized
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
 * @property {string} posAddress
 * @property {string} powAddress
 */

/**
 * @typedef {Object} PoSEpochRewards
 * @property {string} powEpochHash
 * @property {PoSReward[]} accountRewards
 */
format.rewardsByEpoch = format({
  accountRewards: [format({
    reward: format.bigUInt,
  })],
}).$or(null);

/**
 * Class contains pos RPC methods
 * For the detail meaning of fields, please refer to the PoS RPC document:
 * @class
 */
class PoS extends RPCMethodFactory {
  /**
   * Create PoS instance
   * @param {import('../Conflux').Conflux} conflux The Conflux object
   * @return {PoS} The PoS instance
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
       * @example
       * await conflux.pos.getStatus();
       * // {
       * //   epoch: 138,
       * //   latestCommitted: 8235,
       * //   latestTxNumber: '0xa5e2',
       * //   latestVoted: 8238,
       * //   pivotDecision: {
       * //     blockHash: '0x97625d04ece6fe322ae38010ac877447927b4d5963af7eaea7db9befb615e510',
       * //     height: 394020
       * //   }
       * // }
       */
      {
        method: 'pos_getStatus',
        responseFormatter: format.posStatus,
      },
      /**
       * @instance
       * @async
       * @name getAccount
       * @param {Hash} account Account address
       * @param {number|hex} [blockNumber] Optional block number
       * @return {Promise<PoSAccount>}
       * @example
       * await conflux.pos.getAccount('0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3');
       * {
       *   address: '0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3',
       *   blockNumber: 8240,
       *   status: {
       *     availableVotes: 1525,
       *     forceRetired: null,
       *     forfeited: 0,
       *     inQueue: [],
       *     locked: 1525,
       *     outQueue: [],
       *     unlocked: 1
       *   }
       * }
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
       * @param {string} hash The hash of PoS block
       * @return {Promise<PoSBlock>}
       * @example
       * await conflux.pos.getBlockByHash('0x97625d04ece6fe322ae38010ac877447927b4d5963af7eaea7db9befb615e510');
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
       * @param {number|hex} blockNumber The number of PoS block
       * @return {Promise<PoSBlock>}
       * @example
       * await conflux.pos.getBlockByNumber(8235);
       * {
       *   epoch: 138,
       *   hash: '0x1daf5443b7556cc39c3d4fe5e208fa77c3f5c053ea4bd637f5e43dfa7f0a95cb',
       *   height: 8235,
       *   miner: '0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3',
       *   lastTxNumber: 42467,
       *   parentHash: '0x308699b307c81906ab97cbf213532c196f2d718f4641266aa444209349d9e31c',
       *   pivotDecision: {
       *     blockHash: '0x97625d04ece6fe322ae38010ac877447927b4d5963af7eaea7db9befb615e510',
       *     height: 394020
       *   },
       *   round: 15,
       *   signatures: [
       *     {
       *       account: '0x00f7c03318f8c4a7c6ae432e124b4a0474e973139a87f9ea6ae3efba66af7d8a',
       *       votes: 3
       *     }
       *   ],
       *   timestamp: 1638340165169041
       * }
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
       * @param {number|hex} [blockNumber] Optional block number
       * @return {Promise<PoSCommittee>}
       * @example
       * await conflux.pos.getCommittee();
       * {
       *   currentCommittee: {
       *     epochNumber: 138,
       *     nodes: [
       *      {
       *       address: "0xf92d8504fad118ddb5cf475180f5bcffaa967a9f9fa9c3c899ff9ad0de99694a",
       *       votingPower: 3
       *      }
       *     ],
       *     quorumVotingPower: 199,
       *     totalVotingPower: 297
       *   },
       *   elections: [
       *     {
       *       isFinalized: false,
       *       startBlockNumber: 8280,
       *       topElectingNodes: [
       *         {
       *           address: "0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3",
       *           votingPower: 3
       *         }
       *       ]
       *     },
       *     {
       *       isFinalized: false,
       *       startBlockNumber: 8340,
       *       topElectingNodes: []
       *     }
       *   ]
       * }
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
       * @param {number|string} txNumber The number of transaction
       * @return {Promise<PoSTransaction>}
       * @example
       * await conflux.pos.getTransactionByNumber(8235);
       * {
       *   blockHash: '0xe684e88981b7ffe14741a2274e7b65b89ae2e133ebdd783d71ddeeacb4e957d6',
       *   blockNumber: 8243,
       *   from: '0x0000000000000000000000000000000000000000000000000000000000000000',
       *   hash: '0xaa92222b6a20342285ed56de2b77a05a6c1a9a3e4750e4952af8f908f7316b5d',
       *   number: 42480,
       *   payload: null,
       *   status: 'Executed',
       *   timestamp: 1638340649662468,
       *   type: 'BlockMetadata'
       * }
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
       * @method getRewardsByEpoch
       * @name getRewardsByEpoch
       * @param {number|string} epoch A PoS epoch number
       * @return {Promise<PoSEpochRewards>}
       * @example
       * await conflux.pos.getRewardsByEpoch(138);
       * {
       *   accountRewards: [
       *     {
       *       posAddress: '0x83ca56dd7b9d1222fff48565ed0261f42a17099061d905f9e743f89574dbd8e0',
       *       powAddress: 'NET8888:TYPE.USER:AAKFSH1RUYS4P040J5M7DJRJBGMX9ZV7HAJTFN2DKP',
       *       reward: 605265415757735647n
       *     },
       *     ... 122 more items
       *   ],
       *   powEpochHash: '0xd634c0a71c6197a6fad9f80439b31b4c7191b3ee42335b1548dad1160f7f628c'
       * }
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
