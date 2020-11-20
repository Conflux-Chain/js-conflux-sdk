const lodash = require('lodash');
const { Conflux, format } = require('../../src');
const { MockProvider } = require('../../mock');

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';
const BLOCK_HASH = '0xe1b0000000000000000000000000000000000000000000000000000000000001';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const HEX64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// ----------------------------------------------------------------------------
const conflux = new Conflux();
conflux.provider = new MockProvider();

test('getClientVersion', async () => {
  const version = await conflux.getClientVersion();

  expect(lodash.isString(version)).toEqual(true);
});

test('getStatus', async () => {
  const status = await conflux.getStatus();

  expect(Number.isInteger(status.chainId)).toEqual(true);
  expect(Number.isInteger(status.epochNumber)).toEqual(true);
  expect(Number.isInteger(status.blockNumber)).toEqual(true);
  expect(Number.isInteger(status.pendingTxNumber)).toEqual(true);
  expect(status.bestHash.startsWith('0x')).toEqual(true);
});

test('getGasPrice', async () => {
  const gasPrice = await conflux.getGasPrice();

  expect(typeof gasPrice).toEqual('bigint');
});

test('getInterestRate', async () => {
  const interestRate = await conflux.getInterestRate();

  expect(typeof interestRate).toEqual('bigint');
});

test('getAccumulateInterestRate', async () => {
  const interestRate = await conflux.getAccumulateInterestRate();

  expect(typeof interestRate).toEqual('bigint');
});

// ------------------------------- address ----------------------------------
test('getAccount', async () => {
  const account = await conflux.getAccount(ADDRESS);

  expect(typeof account.accumulatedInterestReturn).toEqual('bigint');
  expect(typeof account.balance).toEqual('bigint');
  expect(typeof account.collateralForStorage).toEqual('bigint');
  expect(typeof account.nonce).toEqual('bigint');
  expect(typeof account.stakingBalance).toEqual('bigint');
  expect(account.admin.startsWith('0x')).toEqual(true);
  expect(account.codeHash.startsWith('0x')).toEqual(true);
});

test('getBalance', async () => {
  const balance = await conflux.getBalance(ADDRESS);

  expect(typeof balance).toEqual('bigint');
});

test('getStakingBalance', async () => {
  const balance = await conflux.getStakingBalance(ADDRESS);

  expect(typeof balance).toEqual('bigint');
});

test('getNextNonce', async () => {
  const txCount = await conflux.getNextNonce(ADDRESS);

  expect(typeof txCount).toEqual('bigint');
});

test('getAdmin', async () => {
  const admin = await conflux.getAdmin(ADDRESS);

  expect(admin.startsWith('0x')).toEqual(true);
});

test('getVoteList', async () => {
  const array = await conflux.getVoteList(ADDRESS);

  expect(Array.isArray(array)).toEqual(true);
  expect(typeof array[0].amount).toEqual('bigint');
  expect(Number.isFinite(array[0].unlockBlockNumber)).toEqual(true);
});

test('getDepositList', async () => {
  const array = await conflux.getDepositList(ADDRESS);

  expect(Array.isArray(array)).toEqual(true);
  expect(typeof array[0].amount).toEqual('bigint');
  expect(typeof array[0].accumulatedInterestRate).toEqual('bigint');
  expect(Number.isFinite(array[0].depositTime)).toEqual(true);
});

// -------------------------------- epoch -----------------------------------
test('getEpochNumber', async () => {
  const epochNumber = await conflux.getEpochNumber();

  expect(Number.isInteger(epochNumber)).toEqual(true);
});

test('getBlockByEpochNumber', async () => {
  const block = await conflux.getBlockByEpochNumber(1);
  expect(block.epochNumber).toEqual(1);
});

test('getBlocksByEpochNumber', async () => {
  const blockHashArray = await conflux.getBlocksByEpochNumber(0);

  expect(Array.isArray(blockHashArray)).toEqual(true);
  blockHashArray.forEach(transactionHash => {
    expect(transactionHash.startsWith('0x')).toEqual(true);
  });
});

test('getBlockRewardInfo', async () => {
  const rewardArray = await conflux.getBlockRewardInfo(0);

  expect(Array.isArray(rewardArray)).toEqual(true);
  rewardArray.forEach(reward => {
    expect(reward.blockHash.startsWith('0x')).toEqual(true);
    expect(reward.author.startsWith('0x')).toEqual(true);
    expect(typeof reward.baseReward).toEqual('bigint');
    expect(typeof reward.totalReward).toEqual('bigint');
    expect(typeof reward.txFee).toEqual('bigint');
  });
});

// -------------------------------- block -----------------------------------
test('getBestBlockHash', async () => {
  const transactionHash = await conflux.getBestBlockHash();

  expect(transactionHash.startsWith('0x')).toEqual(true);
});

test('getBlockByHash', async () => {
  const block = await conflux.getBlockByHash(BLOCK_HASH);

  expect(block.hash.startsWith('0x')).toEqual(true);
  expect(block.miner.startsWith('0x')).toEqual(true);
  expect(block.parentHash.startsWith('0x')).toEqual(true);
  expect(block.transactionsRoot.startsWith('0x')).toEqual(true);
  expect(block.deferredLogsBloomHash.startsWith('0x')).toEqual(true);
  expect(block.deferredReceiptsRoot.startsWith('0x')).toEqual(true);
  expect(block.deferredStateRoot.startsWith('0x')).toEqual(true);
  expect(lodash.isBoolean(block.adaptive)).toEqual(true);
  expect(Number.isInteger(block.blame)).toEqual(true);
  expect(Number.isInteger(block.epochNumber)).toEqual(true);
  expect(Number.isInteger(block.size)).toEqual(true);
  expect(Number.isInteger(block.height)).toEqual(true);
  expect(Number.isInteger(block.timestamp)).toEqual(true);
  expect(block.nonce.startsWith('0x')).toEqual(true);
  expect(typeof block.gasLimit).toEqual('bigint');
  expect(typeof block.difficulty).toEqual('bigint');
  expect(Array.isArray(block.refereeHashes)).toEqual(true);
  expect(Array.isArray(block.transactions)).toEqual(true);
  block.transactions.forEach(transactionHash => {
    expect(transactionHash.startsWith('0x')).toEqual(true);
  });

  const blockDetail = await conflux.getBlockByHash(BLOCK_HASH, true);
  expect(Array.isArray(blockDetail.transactions)).toEqual(true);
  blockDetail.transactions.forEach(transaction => {
    expect(lodash.isPlainObject(transaction)).toEqual(true);
  });
});

test('getBlockByHashWithPivotAssumption', async () => {
  const block = await conflux.getBlockByHashWithPivotAssumption(
    '0xb000000104000000000000000000000000000000000000000000000000000000',
    '0xb000000100000000000000000000000000000000000000000000000000000000',
    1,
  );
  expect(block.hash).toEqual('0xb000000104000000000000000000000000000000000000000000000000000000');
  expect(block.epochNumber).toEqual(1);
});

test('getConfirmationRiskByHash', async () => {
  const risk = await conflux.getConfirmationRiskByHash(BLOCK_HASH);

  expect(Number.isFinite(risk)).toEqual(true);
  expect(risk < 1).toEqual(true);
  expect(risk > 0).toEqual(true);
});

// ----------------------------- transaction --------------------------------
test('getTransactionByHash', async () => {
  const transaction = await conflux.getTransactionByHash(TX_HASH);

  expect(transaction.blockHash.startsWith('0x')).toEqual(true);
  expect(transaction.hash.startsWith('0x')).toEqual(true);
  expect(transaction.from.startsWith('0x')).toEqual(true);
  expect(transaction.to.startsWith('0x')).toEqual(true);
  expect(transaction.data.startsWith('0x')).toEqual(true);
  expect(transaction.r.startsWith('0x')).toEqual(true);
  expect(transaction.s.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(transaction.contractCreated) || transaction.contractCreated.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(transaction.transactionIndex)).toEqual(true);
  expect(typeof transaction.nonce).toEqual('bigint');
  expect(lodash.isNull(transaction.status) || Number.isInteger(transaction.status)).toEqual(true);
  expect(Number.isInteger(transaction.v)).toEqual(true);
  expect(typeof transaction.gas).toEqual('bigint');
  expect(typeof transaction.gasPrice).toEqual('bigint');
  expect(typeof transaction.value).toEqual('bigint');
  expect(typeof transaction.storageLimit).toEqual('bigint');
  expect(Number.isInteger(transaction.chainId)).toEqual(true);
  expect(Number.isInteger(transaction.epochHeight)).toEqual(true);
});

test('getTransactionReceipt', async () => {
  const receipt = await conflux.getTransactionReceipt(TX_HASH);

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
  expect(typeof receipt.gasUsed).toEqual('bigint');
  expect(typeof receipt.gasFee).toEqual('bigint');
  expect(Array.isArray(receipt.logs)).toEqual(true);
  expect(receipt.txExecErrorMsg).not.toBeUndefined();
  expect(lodash.isBoolean(receipt.gasCoveredBySponsor)).toEqual(true);
  expect(lodash.isBoolean(receipt.storageCoveredBySponsor)).toEqual(true);
  expect(typeof receipt.storageCollateralized).toEqual('bigint');
  expect(Array.isArray(receipt.storageReleased)).toEqual(true);
  expect(receipt.storageReleased[0].address).toMatch(/^0x[0-9a-f]{40}$/);
  expect(typeof receipt.storageReleased[0].collaterals).toEqual('bigint');
});

test('sendTransaction', async () => {
  const promise = conflux.sendTransaction({
    from: ADDRESS,
    gasPrice: 100,
    gas: 21000,
    value: 1,
    storageLimit: 1000,
  });

  const transactionHash = await promise;
  expect(transactionHash.startsWith('0x')).toEqual(true);

  const transactionCreated = await promise.get({ delta: 0 });
  expect(transactionCreated.hash.startsWith('0x')).toEqual(true);

  const transactionMined = await promise.mined();
  expect(transactionMined.blockHash.startsWith('0x')).toEqual(true);

  const receiptExecute = await promise.executed();
  expect(receiptExecute.outcomeStatus).toEqual(0);

  const receiptConfirmed = await promise.confirmed({ threshold: 1 });
  expect(receiptConfirmed.outcomeStatus).toEqual(0);

  await expect(promise.confirmed({ timeout: 0 })).rejects.toThrow('timeout');
});

// ------------------------------ contract ----------------------------------
test('getCode', async () => {
  const code = await conflux.getCode(ADDRESS);

  expect(code.startsWith('0x')).toEqual(true);
});

test('getStorageAt', async () => {
  const storage = await conflux.getStorageAt(ADDRESS, '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

  expect(storage.startsWith('0x')).toEqual(true);
});

test('getStorageRoot', async () => {
  const storageRoot = await conflux.getStorageRoot(ADDRESS);

  expect(storageRoot.delta.startsWith('0x')).toEqual(true);
  expect(storageRoot.intermediate.startsWith('0x')).toEqual(true);
  expect(storageRoot.snapshot.startsWith('0x')).toEqual(true);
});

test('getSponsorInfo', async () => {
  const info = await conflux.getSponsorInfo(ADDRESS);

  expect(typeof info.sponsorBalanceForCollateral).toEqual('bigint');
  expect(typeof info.sponsorBalanceForGas).toEqual('bigint');
  expect(typeof info.sponsorGasBound).toEqual('bigint');
  expect(info.sponsorForCollateral.startsWith('0x')).toEqual(true);
  expect(info.sponsorForGas.startsWith('0x')).toEqual(true);
});

test('getCollateralForStorage', async () => {
  const collateral = await conflux.getCollateralForStorage(ADDRESS);

  expect(typeof collateral).toEqual('bigint');
});

test('call', async () => {
  const hex = await conflux.call({ to: ADDRESS });

  expect(hex.startsWith('0x')).toEqual(true);
});

test('estimateGasAndCollateral', async () => {
  const estimate = await conflux.estimateGasAndCollateral({});

  expect(typeof estimate.gasUsed).toEqual('bigint');
  expect(typeof estimate.storageCollateralized).toEqual('bigint');
});

test('getLogs', async () => {
  const eventLogs = await conflux.getLogs({ fromEpoch: 0 }); // `fromEpoch` for mock parse
  expect(Array.isArray(eventLogs)).toEqual(true);

  const [eventLog] = eventLogs;
  expect(eventLog.address.startsWith('0x')).toEqual(true);
  expect(eventLog.blockHash.startsWith('0x')).toEqual(true);
  expect(eventLog.transactionHash.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(eventLog.epochNumber)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.logIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionLogIndex)).toEqual(true);
  expect(eventLog.data.startsWith('0x')).toEqual(true);
  eventLog.topics.forEach(topic => {
    expect(topic.startsWith('0x')).toEqual(true);
  });
});

// ------------------------------- subscribe ----------------------------------
test('subscribeEpochs', async () => {
  const subscription = await conflux.subscribeEpochs();

  subscription.on('data', data => {
    expect(data).toEqual({
      epochNumber: 0,
      epochHashesOrdered: [BLOCK_HASH],
    });
  });
  conflux.provider.emit(`${subscription}`, {
    epochNumber: '0x0',
    epochHashesOrdered: [BLOCK_HASH],
  });
});

test('subscribeNewHeads', async () => {
  const subscription = await conflux.subscribeNewHeads();

  subscription.on('data', data => {
    expect(data).toEqual({
      difficulty: format.bigInt('1048575'),
      epochNumber: null,
      gasLimit: format.bigInt('1'),
      height: 10,
      powQuality: '0xfff',
      timestamp: 1602644636,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: HEX64,
      deferredReceiptsRoot: HEX64,
      deferredStateRoot: HEX64,
      hash: BLOCK_HASH,
      miner: ADDRESS,
      nonce: '0x1000000000000000',
      parentHash: BLOCK_HASH,
      refereeHashes: [BLOCK_HASH],
      transactionsRoot: HEX64,
    });
  });
  conflux.provider.emit(subscription.id, {
    adaptive: false,
    blame: 0,
    deferredLogsBloomHash: HEX64,
    deferredReceiptsRoot: HEX64,
    deferredStateRoot: HEX64,
    difficulty: '0xfffff',
    epochNumber: null,
    gasLimit: '0x1',
    hash: BLOCK_HASH,
    height: '0xa',
    miner: ADDRESS,
    nonce: '0x1000000000000000',
    parentHash: BLOCK_HASH,
    powQuality: '0xfff',
    refereeHashes: [BLOCK_HASH],
    timestamp: 1602644636,
    transactionsRoot: HEX64,
  });
});

test('subscribeLogs', async () => {
  const subscription = await conflux.subscribeLogs();

  subscription.on('data', data => {
    expect(data).toEqual({
      epochNumber: 65535,
      logIndex: 0,
      transactionIndex: 0,
      transactionLogIndex: 0,
      address: ADDRESS,
      blockHash: BLOCK_HASH,
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      topics: [HEX64, HEX64, HEX64],
      transactionHash: HEX64,
    });
  });
  conflux.provider.emit(subscription.id, {
    epochNumber: '0xffff',
    logIndex: '0x0',
    transactionIndex: '0x0',
    transactionLogIndex: '0x0',
    address: ADDRESS,
    blockHash: BLOCK_HASH,
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [HEX64, HEX64, HEX64],
    transactionHash: HEX64,
  });

  subscription.on('revert', data => {
    expect(data).toEqual({
      revertTo: 65535,
    });
  });
  conflux.provider.emit(subscription.id, {
    revertTo: '0xffff',
  });
});

afterAll(() => {
  conflux.close();
});
