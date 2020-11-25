/* eslint-disable camelcase */
const EventEmitter = require('events');
const lodash = require('lodash');
const { toHex, padHex, randomPick, randomHex, HexStruct } = require('./util');

const addressStruct = new HexStruct('0xa0', { address: 4 }, 40);
const blockHashStruct = new HexStruct('0xb0', { epochNumber: 6, blockIndex: 2 }, 64);
const txHashStruct = new HexStruct('0xf0', { epochNumber: 6, blockIndex: 2, transactionIndex: 4 }, 64);

/**
 * @param self {MockProvider}
 * @param epochNumber {number}
 * @return {string[]}
 */
function mockBlockHashArray(self, epochNumber) {
  const blockHashArray = lodash.range(self.epochBlockCount).map(
    i => blockHashStruct.encode({ epochNumber, blockIndex: i }),
  );
  return blockHashArray.reverse(); // pivot to last one
}

function mockBlockByHash(self, blockHash) {
  const { epochNumber, blockIndex } = blockHashStruct.decode(blockHash);

  const blockCount = epochNumber * self.epochBlockCount + blockIndex;
  const minerIndex = blockCount % self.addressCount;

  const parentHash = blockIndex === 0
    ? blockHashStruct.encode({ epochNumber: epochNumber ? epochNumber - 1 : 0, blockIndex })
    : blockHashStruct.encode({ epochNumber, blockIndex: blockIndex - 1 });

  const refereeHashes = [blockHashStruct.encode({ epochNumber, blockIndex })];
  const miner = addressStruct.encode({ address: minerIndex });
  const timestamp = self.startTimestamp + (blockCount * self.blockDelta); // in secords

  return {
    epochNumber: toHex(epochNumber),
    parentHash,
    refereeHashes,
    miner,
    timestamp: toHex(timestamp),
  };
}

function mockTxHashArray(self, blockHash) {
  const { epochNumber, blockIndex } = blockHashStruct.decode(blockHash);

  return lodash.range(self.blockTxCount).map(
    i => txHashStruct.encode({ epochNumber, blockIndex, transactionIndex: i }),
  );
}

function mockTxByHash(self, transactionHash) {
  const { epochNumber, blockIndex, transactionIndex } = txHashStruct.decode(transactionHash);

  const blockCount = epochNumber * self.epochBlockCount + blockIndex;
  const txCount = blockCount * self.blockTxCount + transactionIndex;
  const fromIndex = txCount % self.addressCount;
  const toIndex = (txCount + 1) % self.addressCount;

  const blockHash = blockHashStruct.encode({ epochNumber, blockIndex });
  const nonce = Math.floor(txCount / self.addressCount);
  const from = addressStruct.encode({ address: fromIndex });
  const to = addressStruct.encode({ address: toIndex });

  return {
    epochNumber,
    blockHash,
    transactionIndex: toHex(transactionIndex),
    from,
    nonce: toHex(nonce),
    to,
    status: self.stable ? '0x0' : randomPick(null, '0x0', '0x1'),
  };
}

function mockLogsByEpochNumber(self, epochNumber) {
  const [blockHash] = mockBlockHashArray(self, epochNumber);
  if (!blockHash) {
    return [];
  }

  const [transactionHash] = mockTxHashArray(self, blockHash);
  if (!transactionHash) {
    return [];
  }

  const address = addressStruct.encode({ address: epochNumber });
  return lodash.range(self.epochTxCount).map(index => ({
    address,
    epochNumber: toHex(epochNumber),
    blockHash,
    logIndex: randomHex(1),
    transactionHash,
    transactionIndex: toHex(0),
    transactionLogIndex: toHex(index),
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      padHex(epochNumber, 64),
      padHex(epochNumber + 1, 64),
    ],
    data: randomHex(64),
  }));
}

// ----------------------------------------------------------------------------
class MockProvider extends EventEmitter {
  constructor({
    startTimestamp = Math.floor(Date.now() / 1000) - 2 * 30 * 24 * 3600,
    blockDelta = 1,
    addressCount = 10,
    epochBlockCount = 5,
    blockTxCount = 2,
    epochTxCount = 2,
    stable = true,
  } = {}) {
    super();
    this.startTimestamp = startTimestamp;
    this.blockDelta = blockDelta;
    this.addressCount = addressCount;
    this.epochBlockCount = epochBlockCount;
    this.blockTxCount = blockTxCount;
    this.epochTxCount = epochTxCount;
    this.stable = stable;
  }

  async call(method, ...params) {
    return this[method](...params);
  }

  close() {}

  // --------------------------------------------------------------------------
  cfx_clientVersion() {
    return 'mock';
  }

  cfx_getSupplyInfo() {
    return {
      totalIssued: randomHex(20),
      totalStaking: randomHex(18),
      totalCollateral: randomHex(18),
    };
  }

  cfx_getStatus() {
    return {
      chainId: toHex(1),
      epochNumber: randomHex(4),
      blockNumber: randomHex(4),
      pendingTxNumber: randomHex(4),
      bestHash: randomHex(64),
    };
  }

  cfx_gasPrice() {
    return randomHex(2);
  }

  cfx_getInterestRate() {
    return randomHex(10);
  }

  cfx_getAccumulateInterestRate() {
    return randomHex(10);
  }

  // ------------------------------- address ----------------------------------
  cfx_getAccount() {
    return {
      accumulatedInterestReturn: randomHex(4),
      balance: randomHex(8),
      collateralForStorage: randomHex(4),
      nonce: randomHex(2),
      stakingBalance: randomHex(2),
      admin: '0x0000000000000000000000000000000000000000',
      codeHash: randomHex(64),
    };
  }

  cfx_getBalance(address, epochNumber) {
    return Number(epochNumber) ? randomHex(8) : '0x0';
  }

  cfx_getStakingBalance() {
    return randomHex(10);
  }

  cfx_getNextNonce(address, epochNumber) {
    if ([undefined, 'latest_state', 'latest_mined'].includes(epochNumber)) {
      return toHex(Number.MAX_SAFE_INTEGER);
    }

    const number = (Number(epochNumber) * this.epochBlockCount * this.blockTxCount) / this.addressCount;
    return toHex(Math.floor(number));
  }

  cfx_getAdmin() {
    return randomHex(40);
  }

  cfx_getVoteList(address, epochNumber) {
    return lodash.range(2).map(() => ({
      amount: randomHex(8),
      unlockBlockNumber: epochNumber === undefined ? lodash.random(0, 1000) : epochNumber * 2,
    }));
  }

  cfx_getDepositList(address, epochNumber) {
    return lodash.range(2).map(() => ({
      amount: randomHex(8),
      accumulatedInterestRate: randomHex(16),
      depositTime: epochNumber === undefined ? lodash.random(100000, 999999) : epochNumber,
    }));
  }

  // -------------------------------- epoch -----------------------------------
  cfx_epochNumber() {
    return toHex(Number.MAX_SAFE_INTEGER);
  }

  cfx_getBlockByEpochNumber(epochNumber, detail) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    return this.cfx_getBlockByHash(lodash.last(blockHashArray), detail);
  }

  cfx_getBlocksByEpoch(epochNumber) {
    return mockBlockHashArray(this, epochNumber);
  }

  cfx_getBlockRewardInfo(epochNumber) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    return blockHashArray.map(blockHash => {
      const block = this.cfx_getBlockByHash(blockHash);
      return {
        blockHash,
        author: block.miner,
        baseReward: randomHex(8),
        totalReward: randomHex(10),
        txFee: randomHex(12),
      };
    });
  }

  // -------------------------------- block -----------------------------------
  cfx_getBestBlockHash() {
    return randomHex(64); // XXX
  }

  cfx_getBlockByHash(blockHash, detail = false) {
    const { epochNumber, parentHash, refereeHashes, miner, timestamp } = mockBlockByHash(this, blockHash);

    let transactions = mockTxHashArray(this, blockHash);
    if (detail) {
      transactions = transactions.map(transactionHash => this.cfx_getTransactionByHash(transactionHash));
    }

    return {
      adaptive: randomPick(true, false),
      blame: randomHex(1),
      deferredLogsBloomHash: randomHex(64),
      deferredReceiptsRoot: randomHex(64),
      deferredStateRoot: randomHex(64),
      difficulty: randomHex(8),
      epochNumber,
      gasLimit: randomHex(2),
      hash: blockHash,
      height: epochNumber,
      miner,
      nonce: randomHex(16),
      parentHash,
      refereeHashes,
      size: randomHex(4),
      powQuality: randomHex(4),
      timestamp,
      transactions,
      transactionsRoot: randomHex(64),
    };
  }

  cfx_getBlockByHashWithPivotAssumption(blockHash, pivotHash, epochNumber) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    if (lodash.last(blockHashArray) !== pivotHash || !blockHashArray.includes(blockHash)) {
      throw new Error('{"code":-32602,"message":"Error: pivot chain assumption failed"}');
    }

    const block = this.cfx_getBlockByHash(blockHash, true);
    block.stable = randomPick(true, false);
    block.transactions.forEach(transaction => {
      transaction.status = randomPick('0x0', '0x01');
    });
    return block;
  }

  cfx_getConfirmationRiskByHash() {
    return randomHex(64);
  }

  // ----------------------------- transaction --------------------------------
  cfx_getTransactionByHash(transactionHash) {
    const { epochNumber, blockHash, from, nonce, to, transactionIndex, status } = mockTxByHash(this, transactionHash);

    return {
      blockHash,
      contractCreated: null,
      data: randomHex(100),
      from,
      gas: randomHex(5), // gasLimit
      gasPrice: randomHex(2),
      hash: transactionHash,
      nonce,
      r: randomHex(64),
      s: randomHex(64),
      status,
      to,
      transactionIndex,
      v: randomPick('0x0', '0x1'),
      value: randomHex(4),
      storageLimit: randomHex(10),
      chainId: '0x0',
      epochHeight: epochNumber,
    };
  }

  cfx_getTransactionReceipt(transactionHash) {
    const { blockHash, from, to, transactionIndex, status } = mockTxByHash(this, transactionHash);
    const { epochNumber } = mockBlockByHash(this, transactionHash);

    return {
      blockHash,
      contractCreated: randomPick(null, randomHex(40)),
      epochNumber: toHex(epochNumber),
      from,
      gasUsed: randomHex(5),
      gasFee: randomHex(5),
      index: toHex(transactionIndex),
      logs: [],
      logsBloom: randomHex(512),
      outcomeStatus: status === null ? null : toHex(status),
      stateRoot: randomHex(64),
      to,
      transactionHash,
      txExecErrorMsg: status === null ? null : 'mock error message',
      gasCoveredBySponsor: false,
      storageCoveredBySponsor: true,
      storageCollateralized: randomHex(4),
      storageReleased: [
        {
          address: from,
          collaterals: randomHex(4),
        },
      ],
    };
  }

  cfx_sendRawTransaction() {
    return randomHex(64);
  }

  cfx_sendTransaction() {
    return randomHex(64);
  }

  // ------------------------------ contract ----------------------------------
  cfx_getCode() {
    return randomHex(100);
  }

  cfx_getStorageAt() {
    return randomHex(64);
  }

  cfx_getStorageRoot() {
    return {
      delta: randomHex(64),
      intermediate: randomHex(64),
      snapshot: randomHex(64),
    };
  }

  cfx_getSponsorInfo() {
    return {
      sponsorBalanceForCollateral: randomHex(2),
      sponsorBalanceForGas: randomHex(2),
      sponsorGasBound: randomHex(2),
      sponsorForCollateral: '0x0000000000000000000000000000000000000000',
      sponsorForGas: '0x0000000000000000000000000000000000000000',
    };
  }

  cfx_getCollateralForStorage() {
    return randomHex(10);
  }

  cfx_call() {
    return padHex(100, 64);
  }

  cfx_estimateGasAndCollateral() {
    return {
      gasUsed: randomHex(4),
      gasLimit: randomHex(4),
      storageCollateralized: randomHex(4),
    };
  }

  cfx_getLogs({ fromEpoch, topics }) {
    const epochNumber = Number(fromEpoch); // Number or NaN

    if (Number.isInteger(epochNumber)) {
      return mockLogsByEpochNumber(this, epochNumber, topics);
    }

    return [];
  }

  // ------------------------------ subscribe ---------------------------------
  cfx_subscribe() {
    return randomHex(16);
  }

  cfx_unsubscribe() {
    return randomPick(true, false);
  }
}

module.exports = MockProvider;
