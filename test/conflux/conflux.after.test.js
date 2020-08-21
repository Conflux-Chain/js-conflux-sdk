const JSBI = require('jsbi');
const lodash = require('lodash');
const { Conflux } = require('../../src');
const { MockProvider } = require('../../mock');

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';
const BLOCK_HASH = '0xe1b0000000000000000000000000000000000000000000000000000000000001';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';

// ----------------------------------------------------------------------------
const cfx = new Conflux();
cfx.provider = new MockProvider();

test('getStatus', async () => {
  const status = await cfx.getStatus();

  expect(Number.isInteger(status.chainId)).toEqual(true);
  expect(Number.isInteger(status.epochNumber)).toEqual(true);
  expect(Number.isInteger(status.blockNumber)).toEqual(true);
  expect(Number.isInteger(status.pendingTxNumber)).toEqual(true);
  expect(status.bestHash.startsWith('0x')).toEqual(true);
});

test('getGasPrice', async () => {
  const gasPrice = await cfx.getGasPrice();

  expect(gasPrice.constructor).toEqual(JSBI);
});

test('getEpochNumber', async () => {
  const epochNumber = await cfx.getEpochNumber();

  expect(Number.isInteger(epochNumber)).toEqual(true);
});

test('getLogs', async () => {
  const eventLogs = await cfx.getLogs({ fromEpoch: 0 }); // `fromEpoch` for mock parse
  expect(Array.isArray(eventLogs)).toEqual(true);

  const [eventLog] = eventLogs;
  expect(eventLog.address.startsWith('0x')).toEqual(true);
  expect(eventLog.blockHash.startsWith('0x')).toEqual(true);
  expect(eventLog.transactionHash.startsWith('0x')).toEqual(true);
  expect(lodash.isString(eventLog.type)).toEqual(true);
  expect(lodash.isBoolean(eventLog.removed)).toEqual(true);
  expect(Number.isInteger(eventLog.epochNumber)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.logIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionLogIndex)).toEqual(true);
  expect(eventLog.data.startsWith('0x')).toEqual(true);
  eventLog.topics.forEach(topic => {
    expect(topic.startsWith('0x')).toEqual(true);
  });
});

test('getBalance', async () => {
  const balance = await cfx.getBalance(ADDRESS);

  expect(balance.constructor).toEqual(JSBI);
});

test('getNextNonce', async () => {
  const txCount = await cfx.getNextNonce(ADDRESS);

  expect(txCount.constructor).toEqual(JSBI);
});

test('getConfirmationRiskByHash', async () => {
  const risk = await cfx.getConfirmationRiskByHash(BLOCK_HASH);

  expect(Number.isFinite(risk)).toEqual(true);
});

test('getBestBlockHash', async () => {
  const txHash = await cfx.getBestBlockHash();

  expect(txHash.startsWith('0x')).toEqual(true);
});

test('getBlocksByEpochNumber', async () => {
  const blockHashArray = await cfx.getBlocksByEpochNumber(0);

  expect(Array.isArray(blockHashArray)).toEqual(true);
  blockHashArray.forEach(txHash => {
    expect(txHash.startsWith('0x')).toEqual(true);
  });
});

test('getBlockByHash', async () => {
  const block = await cfx.getBlockByHash(BLOCK_HASH);

  expect(block.hash.startsWith('0x')).toEqual(true);
  expect(block.miner.startsWith('0x')).toEqual(true);
  expect(block.parentHash.startsWith('0x')).toEqual(true);
  expect(block.transactionsRoot.startsWith('0x')).toEqual(true);
  expect(block.deferredLogsBloomHash.startsWith('0x')).toEqual(true);
  expect(block.deferredReceiptsRoot.startsWith('0x')).toEqual(true);
  expect(block.deferredStateRoot.startsWith('0x')).toEqual(true);
  expect(lodash.isBoolean(block.adaptive)).toEqual(true);
  // expect(lodash.isBoolean(block.stable)).toEqual(true); ???
  expect(Number.isInteger(block.blame)).toEqual(true);
  expect(Number.isInteger(block.epochNumber)).toEqual(true);
  expect(Number.isInteger(block.size)).toEqual(true);
  expect(Number.isInteger(block.height)).toEqual(true);
  expect(Number.isInteger(block.timestamp)).toEqual(true);
  expect(block.nonce.startsWith('0x')).toEqual(true);
  expect(block.gasLimit.constructor).toEqual(JSBI);
  expect(block.difficulty.constructor).toEqual(JSBI);
  expect(Array.isArray(block.refereeHashes)).toEqual(true);
  expect(Array.isArray(block.transactions)).toEqual(true);
  block.transactions.forEach(txHash => {
    expect(txHash.startsWith('0x')).toEqual(true);
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
    '0xb000000104000000000000000000000000000000000000000000000000000000',
    '0xb000000100000000000000000000000000000000000000000000000000000000',
    1,
  );
  expect(block.hash).toEqual('0xb000000104000000000000000000000000000000000000000000000000000000');
  expect(block.epochNumber).toEqual(1);
});

test('getTransactionByHash', async () => {
  const transaction = await cfx.getTransactionByHash(TX_HASH);

  expect(transaction.blockHash.startsWith('0x')).toEqual(true);
  expect(transaction.hash.startsWith('0x')).toEqual(true);
  expect(transaction.from.startsWith('0x')).toEqual(true);
  expect(transaction.to.startsWith('0x')).toEqual(true);
  expect(transaction.data.startsWith('0x')).toEqual(true);
  expect(transaction.r.startsWith('0x')).toEqual(true);
  expect(transaction.s.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(transaction.contractCreated) || transaction.contractCreated.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(transaction.transactionIndex)).toEqual(true);
  expect(Number.isInteger(transaction.nonce)).toEqual(true);
  expect(lodash.isNull(transaction.status) || Number.isInteger(transaction.status)).toEqual(true);
  expect(Number.isInteger(transaction.v)).toEqual(true);
  expect(transaction.gas.constructor).toEqual(JSBI);
  expect(transaction.gasPrice.constructor).toEqual(JSBI);
  expect(transaction.value.constructor).toEqual(JSBI);
  expect(transaction.storageLimit.constructor).toEqual(JSBI);
  expect(Number.isInteger(transaction.chainId)).toEqual(true);
  expect(Number.isInteger(transaction.epochHeight)).toEqual(true);
});

test('getTransactionReceipt', async () => {
  const receipt = await cfx.getTransactionReceipt(TX_HASH);

  expect(receipt.blockHash.startsWith('0x')).toEqual(true);
  expect(receipt.transactionHash.startsWith('0x')).toEqual(true);
  expect(receipt.from.startsWith('0x')).toEqual(true);
  expect(receipt.to.startsWith('0x')).toEqual(true);
  expect(receipt.logsBloom.startsWith('0x')).toEqual(true);
  expect(receipt.stateRoot.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(receipt.contractCreated) || receipt.contractCreated.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(receipt.index)).toEqual(true);
  expect(Number.isInteger(receipt.epochNumber)).toEqual(true);
  expect(lodash.isNull(receipt.outcomeStatus) || Number.isInteger(receipt.outcomeStatus)).toEqual(true);
  expect(receipt.gasUsed.constructor).toEqual(JSBI);
  expect(Array.isArray(receipt.logs)).toEqual(true);
});

test('sendTransaction by address', async () => {
  const promise = cfx.sendTransaction({
    nonce: 0,
    from: ADDRESS,
    gasPrice: 100,
    gas: 21000,
    chainId: 0,
  });

  const txHash = await promise;
  expect(txHash.startsWith('0x')).toEqual(true);

  const transactionCreated = await promise.get({ delta: 0 });
  expect(transactionCreated.hash.startsWith('0x')).toEqual(true);

  const transactionMined = await promise.mined();
  expect(transactionMined.blockHash.startsWith('0x')).toEqual(true);

  const receiptExecute = await promise.executed();
  expect(receiptExecute.outcomeStatus).toEqual(0);

  const receiptConfirmed = await promise.confirmed({ threshold: 1 });
  expect(receiptConfirmed.outcomeStatus).toEqual(0);

  await expect(promise.confirmed({ timeout: 0 })).rejects.toThrow('Timeout');
});

test('checkBalanceAgainstTransaction', async() => {
  const balanceEnoughResponse = await cfx.checkBalanceAgainstTransaction({
    from: ADDRESS,
    nonce: 0,
    gasPrice: 100,
    gas: 21000,
    chainId: 0,
  });
  expect(balanceEnoughResponse.willPayTxFee).toEqual(true);
  expect(balanceEnoughResponse.willPayCollateral).toEqual(true);
  expect(balanceEnoughResponse.isBalanceEnough).toEqual(true);
});
