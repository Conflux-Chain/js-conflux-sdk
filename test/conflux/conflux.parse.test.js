const lodash = require('lodash');
const BigNumber = require('bignumber.js');
const { Hex } = require('../../src/utils/type');

const Conflux = require('../../src');
const MockProvider = require('../__mocks__/MockProvider');

const ADDRESS = '0xa000000000000000000000000000000000000001';
const BLOCK_HASH = '0xe1b0000000000000000000000000000000000000000000000000000000000001';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';

// ----------------------------------------------------------------------------
const cfx = new Conflux();
cfx.provider = new MockProvider();

test('getGasPrice', async () => {
  const gasPrice = await cfx.getGasPrice();

  expect(BigNumber.isBigNumber(gasPrice)).toEqual(true);
});

test('getEpochNumber', async () => {
  const epochNumber = await cfx.getEpochNumber();

  expect(Number.isInteger(epochNumber)).toEqual(true);
});

test('getLogs', async () => {
  const eventLogs = await cfx.getLogs({});
  expect(Array.isArray(eventLogs)).toEqual(true);

  const [eventLog] = eventLogs;
  expect(Hex.isHex(eventLog.address)).toEqual(true);
  expect(Hex.isHex(eventLog.blockHash)).toEqual(true);
  expect(Hex.isHex(eventLog.transactionHash)).toEqual(true);
  expect(lodash.isString(eventLog.type)).toEqual(true);
  expect(lodash.isBoolean(eventLog.removed)).toEqual(true);
  expect(Number.isInteger(eventLog.epochNumber)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.logIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionLogIndex)).toEqual(true);
  expect(eventLog.data.startsWith('0x')).toEqual(true);
  eventLog.topics.forEach(topic => {
    expect(Hex.isHex(topic)).toEqual(true);
  });
});

test('getBalance', async () => {
  const balance = await cfx.getBalance(ADDRESS);

  expect(BigNumber.isBigNumber(balance)).toEqual(true);
  expect(balance.isInteger()).toEqual(true);
});

test('getTransactionCount', async () => {
  const txCount = await cfx.getTransactionCount(ADDRESS);

  expect(Number.isInteger(txCount)).toEqual(true);
});

test('getBestBlockHash', async () => {
  const txHash = await cfx.getBestBlockHash();

  expect(Hex.isHex(txHash)).toEqual(true);
});

test('getBlocksByEpochNumber', async () => {
  const blockHashArray = await cfx.getBlocksByEpochNumber(0);

  expect(Array.isArray(blockHashArray)).toEqual(true);
  blockHashArray.forEach(txHash => {
    expect(Hex.isHex(txHash)).toEqual(true);
  });
});

test('getBlockByHash', async () => {
  const block = await cfx.getBlockByHash(BLOCK_HASH);

  expect(Hex.isHex(block.hash)).toEqual(true);
  expect(Hex.isHex(block.miner)).toEqual(true);
  expect(Hex.isHex(block.parentHash)).toEqual(true);
  expect(Hex.isHex(block.transactionsRoot)).toEqual(true);
  expect(Hex.isHex(block.deferredLogsBloomHash)).toEqual(true);
  expect(Hex.isHex(block.deferredReceiptsRoot)).toEqual(true);
  expect(Hex.isHex(block.deferredStateRoot)).toEqual(true);
  expect(lodash.isBoolean(block.adaptive)).toEqual(true);
  // expect(lodash.isBoolean(block.stable)).toEqual(true); ???
  expect(Number.isInteger(block.blame)).toEqual(true);
  expect(Number.isInteger(block.epochNumber)).toEqual(true);
  expect(Number.isInteger(block.size)).toEqual(true);
  expect(Number.isInteger(block.height)).toEqual(true);
  expect(Number.isInteger(block.timestamp)).toEqual(true);
  expect(block.nonce.startsWith('0x')).toEqual(true);
  expect(BigNumber.isBigNumber(block.gasLimit)).toEqual(true);
  expect(BigNumber.isBigNumber(block.difficulty)).toEqual(true);
  expect(Array.isArray(block.refereeHashes)).toEqual(true);
  expect(Array.isArray(block.transactions)).toEqual(true);
  expect(lodash.isPlainObject(block.deferredStateRootWithAux)).toEqual(true);
  block.transactions.forEach(txHash => {
    expect(Hex.isHex(txHash)).toEqual(true);
  });

  const blockDetail = await cfx.getBlockByHash(BLOCK_HASH, true);
  expect(Array.isArray(blockDetail.transactions)).toEqual(true);
  blockDetail.transactions.forEach(tx => {
    expect(lodash.isPlainObject(tx)).toEqual(true);
  });
});

test('getBlockByEpochNumber', async () => {
  const block = await cfx.getBlockByEpochNumber(1);
  expect(block.epochNumber).toEqual(1);
});

test('getBlockByHashWithPivotAssumption', async () => {
  const block = await cfx.getBlockByHashWithPivotAssumption(
    '0xe1b0000000000000000000000000000000000000000000000000000000000000',
    '0xe1b0000000000000000000000000000000000000000000000000000000000001',
    1,
  );
  expect(block.hash).toEqual('0xe1b0000000000000000000000000000000000000000000000000000000000000');
  expect(block.epochNumber).toEqual(1);
});

test('getTransactionByHash', async () => {
  const transaction = await cfx.getTransactionByHash(TX_HASH);

  expect(Hex.isHex(transaction.blockHash)).toEqual(true);
  expect(Hex.isHex(transaction.hash)).toEqual(true);
  expect(Hex.isHex(transaction.from)).toEqual(true);
  expect(Hex.isHex(transaction.to)).toEqual(true);
  expect(transaction.data.startsWith('0x')).toEqual(true);
  expect(Hex.isHex(transaction.r)).toEqual(true);
  expect(Hex.isHex(transaction.s)).toEqual(true);
  expect(Hex.isHex(transaction.contractCreated) || lodash.isNull(transaction.contractCreated)).toEqual(true);
  expect(Number.isInteger(transaction.transactionIndex)).toEqual(true);
  expect(Number.isInteger(transaction.nonce)).toEqual(true);
  expect(Number.isInteger(transaction.status)).toEqual(true);
  expect(Number.isInteger(transaction.v)).toEqual(true);
  expect(BigNumber.isBigNumber(transaction.gas)).toEqual(true);
  expect(BigNumber.isBigNumber(transaction.gasPrice)).toEqual(true);
  expect(BigNumber.isBigNumber(transaction.value)).toEqual(true);
});

test('getTransactionReceipt', async () => {
  const receipt = await cfx.getTransactionReceipt(TX_HASH);

  expect(Hex.isHex(receipt.blockHash)).toEqual(true);
  expect(Hex.isHex(receipt.transactionHash)).toEqual(true);
  expect(Hex.isHex(receipt.from)).toEqual(true);
  expect(Hex.isHex(receipt.to)).toEqual(true);
  expect(Hex.isHex(receipt.logsBloom)).toEqual(true);
  expect(Hex.isHex(receipt.stateRoot)).toEqual(true);
  expect(Hex.isHex(receipt.contractCreated) || lodash.isNull(receipt.contractCreated)).toEqual(true);
  expect(Number.isInteger(receipt.index)).toEqual(true);
  expect(Number.isInteger(receipt.epochNumber)).toEqual(true);
  expect(Number.isInteger(receipt.outcomeStatus)).toEqual(true);
  expect(BigNumber.isBigNumber(receipt.gasUsed)).toEqual(true);
  expect(Array.isArray(receipt.logs)).toEqual(true);
});

test('sendTransaction by address', async () => {
  const promise = cfx.sendTransaction({
    nonce: 0,
    from: ADDRESS,
    gasPrice: 100,
    gas: 21000,
  });

  const txHash = await promise;
  expect(Hex.isHex(txHash)).toEqual(true);

  const transactionCreated = await promise.get({ delta: 0 });
  expect(Hex.isHex(transactionCreated.hash)).toEqual(true);

  const transactionMined = await promise.mined();
  expect(Hex.isHex(transactionMined.blockHash)).toEqual(true);

  const receiptExecute = await promise.executed();
  expect(receiptExecute.outcomeStatus).toEqual(0);

  const receiptConfirmed = await promise.confirmed({ bar: 0.01 });
  expect(receiptConfirmed.outcomeStatus).toEqual(0);

  await expect(promise.confirmed({ timeout: 0 })).rejects.toThrow('Timeout');
});
