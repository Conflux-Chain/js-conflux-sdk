/* eslint-disable camelcase */
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

function mockTxByHash(self, txHash) {
  const { epochNumber, blockIndex, transactionIndex } = txHashStruct.decode(txHash);

  const blockCount = epochNumber * self.epochBlockCount + blockIndex;
  const txCount = blockCount * self.blockTxCount + transactionIndex;
  const fromIndex = txCount % self.addressCount;
  const toIndex = (txCount + 1) % self.addressCount;

  const blockHash = blockHashStruct.encode({ epochNumber, blockIndex });
  const nonce = Math.floor(txCount / self.addressCount);
  const from = addressStruct.encode({ address: fromIndex });
  const to = addressStruct.encode({ address: toIndex });

  return {
    blockHash,
    transactionIndex: toHex(transactionIndex),
    from,
    nonce: toHex(nonce),
    to,
    status: self.stable ? '0x0' : randomPick(null, '0x0', '0x1'),
  };
}

function mockLogsByEpochNumber(self, epochNumber, [topic] = []) {
  const [blockHash] = mockBlockHashArray(self, epochNumber);
  if (!blockHash) {
    return [];
  }

  const [txHash] = mockTxHashArray(self, blockHash);
  if (!txHash) {
    return [];
  }

  return lodash.range(self.txLogCount)
    .map(index => ({
      address: randomHex(40),
      blockHash: randomHex(64),
      data: randomHex(64),
      epochNumber: toHex(epochNumber),
      logIndex: randomHex(1),
      removed: false,
      topics: [
        topic || randomHex(64),
        randomHex(64),
      ],
      transactionHash: txHash,
      transactionIndex: toHex(0),
      transactionLogIndex: toHex(index),
      type: 'mined',
    }));
}

// ----------------------------------------------------------------------------
class MockProvider {
  constructor({
    startTimestamp = Math.floor(Date.now() / 1000) - 2 * 30 * 24 * 3600,
    blockDelta = 1,
    addressCount = 10,
    epochBlockCount = 5,
    blockTxCount = 2,
    txLogCount = 2,
    stable = true,
  } = {}) {
    this.startTimestamp = startTimestamp;
    this.blockDelta = blockDelta;
    this.addressCount = addressCount;
    this.epochBlockCount = epochBlockCount;
    this.blockTxCount = blockTxCount;
    this.txLogCount = txLogCount;
    this.stable = stable;
  }

  async call(method, ...params) {
    return this[method](...params);
  }

  close() {}

  // --------------------------------------------------------------------------
  cfx_gasPrice() {
    return randomHex(2);
  }

  cfx_epochNumber() {
    return toHex(Number.MAX_SAFE_INTEGER);
  }

  cfx_getLogs({ fromEpoch, topics }) {
    const epochNumber = Number(fromEpoch); // Number or NaN

    if (Number.isInteger(epochNumber)) {
      return mockLogsByEpochNumber(this, epochNumber, topics);
    }

    return [];
  }

  // ------------------------------- address ----------------------------------
  cfx_getBalance(address, epochNumber) {
    return Number(epochNumber) ? randomHex(8) : '0x0';
  }

  cfx_getNextNonce(address, epochNumber) {
    if (['latest_state', 'latest_mined'].includes(epochNumber)) {
      return toHex(Number.MAX_SAFE_INTEGER);
    }

    const number = (Number(epochNumber) * this.epochBlockCount * this.blockTxCount) / this.addressCount;
    return toHex(Math.floor(number));
  }

  // -------------------------------- epoch -----------------------------------
  cfx_getBlockByEpochNumber(epochNumber, detail) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    return this.cfx_getBlockByHash(lodash.last(blockHashArray), detail);
  }

  cfx_getBlocksByEpoch(epochNumber) {
    return mockBlockHashArray(this, epochNumber);
  }

  // -------------------------------- block -----------------------------------
  cfx_getBestBlockHash() {
    return randomHex(64); // XXX
  }

  cfx_getBlockByHash(blockHash, detail = false) {
    const { epochNumber, parentHash, refereeHashes, miner, timestamp } = mockBlockByHash(this, blockHash);

    let transactions = mockTxHashArray(this, blockHash);
    if (detail) {
      transactions = transactions.map(txHash => this.cfx_getTransactionByHash(txHash));
    }

    return {
      adaptive: randomPick(true, false),
      blame: 0,
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
      stable: randomPick(null, true, false),
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
    block.transactions.forEach(tx => {
      tx.status = randomPick('0x0', '0x01');
    });
    return block;
  }

  // ----------------------------- transaction --------------------------------
  cfx_getTransactionByHash(txHash) {
    const { blockHash, from, nonce, to, transactionIndex, status } = mockTxByHash(this, txHash);

    return {
      blockHash,
      contractCreated: null,
      data: randomHex(100),
      from,
      gas: randomHex(5), // gasLimit
      gasPrice: randomHex(2),
      hash: txHash,
      nonce,
      r: randomHex(64),
      s: randomHex(64),
      status,
      to,
      transactionIndex,
      v: randomPick('0x0', '0x1'),
      value: randomHex(4),
    };
  }

  cfx_getTransactionReceipt(txHash) {
    const { blockHash, from, to, transactionIndex, status } = mockTxByHash(this, txHash);
    const { epochNumber } = mockBlockByHash(this, txHash);

    return {
      blockHash,
      contractCreated: randomPick(null, randomHex(40)),
      epochNumber: Number(epochNumber),
      from,
      gasUsed: randomHex(5), // gasLimit
      index: Number(transactionIndex),
      logs: [],
      logsBloom: randomHex(512),
      outcomeStatus: status === null ? null : Number(status),
      stateRoot: randomHex(64),
      to,
      transactionHash: txHash,
    };
  }

  cfx_sendTransaction() {
    return randomHex(64);
  }

  cfx_sendRawTransaction() {
    return randomHex(64);
  }

  cfx_call() {
    return padHex(100, 64);
  }

  cfx_estimateGasAndCollateral() {
    return {
      gasUsed: randomHex(4),
      storageCollateralized: randomHex(4),
    };
  }
}

module.exports = MockProvider;
