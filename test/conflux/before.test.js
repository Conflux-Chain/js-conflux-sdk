const lodash = require('lodash');
const { Conflux, CONST } = require('../../src');
const { MockProvider } = require('../../mock');
const format = require('../../src/util/format');

const HEX_ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';
const BLOCK_HASH = '0xe0b0000000000000000000000000000000000000000000000000000000000000';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const PASSWORD = '123456';

// ----------------------------------------------------------------------------
const conflux = new Conflux({
  defaultGasPrice: lodash.random(0, 1000),
  networkId: CONST.TESTNET_ID,
});
conflux.provider = new MockProvider();

// ------------------------------- address ----------------------------------
test('getBalance', async () => {
  await expect(conflux.getBalance()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getBalance(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getBalance', ADDRESS, undefined);

  await conflux.getBalance(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getBalance', ADDRESS, 'latest_state');

  await conflux.getBalance(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getBalance', ADDRESS, '0x0');

  call.mockRestore();
});

test('getNextNonce', async () => {
  await expect(conflux.getNextNonce()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getNextNonce(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getNextNonce', ADDRESS, undefined);

  await conflux.getNextNonce(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getNextNonce', ADDRESS, 'latest_state');

  await conflux.getNextNonce(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getNextNonce', ADDRESS, '0x0');

  call.mockRestore();
});

test('getAdmin', async () => {
  await expect(conflux.getAdmin()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getAdmin(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getAdmin', ADDRESS, undefined);

  await conflux.getAdmin(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getAdmin', ADDRESS, 'latest_state');

  await conflux.getAdmin(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getAdmin', ADDRESS, '0x0');

  call.mockRestore();
});

test('getVoteList', async () => {
  await expect(conflux.getVoteList()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getVoteList(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getVoteList', ADDRESS, undefined);

  await conflux.getVoteList(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getVoteList', ADDRESS, 'latest_state');

  await conflux.getVoteList(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getVoteList', ADDRESS, '0x0');

  call.mockRestore();
});

test('getDepositList', async () => {
  await expect(conflux.getDepositList()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getDepositList(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getDepositList', ADDRESS, undefined);

  await conflux.getDepositList(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getDepositList', ADDRESS, 'latest_state');

  await conflux.getDepositList(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getDepositList', ADDRESS, '0x0');

  call.mockRestore();
});

// -------------------------------- epoch -----------------------------------
test('getEpochNumber', async () => {
  await expect(conflux.getEpochNumber(null)).rejects.toThrow('not match any');
  await expect(conflux.getEpochNumber('xxx')).rejects.toThrow('not match any');
  await expect(conflux.getEpochNumber('EARLIEST')).rejects.toThrow('not match any');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getEpochNumber();
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', undefined);

  await conflux.getEpochNumber(0);
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', '0x0');

  await conflux.getEpochNumber('100');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', '0x64');

  await conflux.getEpochNumber('0x0a');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', '0xa');

  await conflux.getEpochNumber('earliest');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', 'earliest');

  await conflux.getEpochNumber('latest_checkpoint');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', 'latest_checkpoint');

  await conflux.getEpochNumber('latest_confirmed');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', 'latest_confirmed');

  await conflux.getEpochNumber('latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', 'latest_state');

  await conflux.getEpochNumber('latest_mined');
  expect(call).toHaveBeenLastCalledWith('cfx_epochNumber', 'latest_mined');

  call.mockRestore();
});

test('getBlockByEpochNumber', async () => {
  await expect(conflux.getBlockByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');
  await expect(conflux.getBlockByEpochNumber(0, 1)).rejects.toThrow('not match "boolean"');

  const call = jest.spyOn(conflux.provider, 'call');
  call.mockReturnValue(null);

  await conflux.getBlockByEpochNumber('latest_state', false);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByEpochNumber', 'latest_state', false);

  await conflux.getBlockByEpochNumber(0, true);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByEpochNumber', '0x0', true);

  call.mockRestore();
});

test('getBlocksByEpochNumber', async () => {
  await expect(conflux.getBlocksByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getBlocksByEpochNumber(0);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlocksByEpoch', '0x0');

  call.mockRestore();
});

test('getBlockRewardInfo', async () => {
  await expect(conflux.getBlockRewardInfo()).rejects.toThrow('Cannot convert undefined to a BigInt');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getBlockRewardInfo(10);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockRewardInfo', '0xa');

  call.mockRestore();
});

// -------------------------------- block -----------------------------------
test('getBlockByHash', async () => {
  await expect(conflux.getBlockByHash()).rejects.toThrow('not match "hex"');
  await expect(conflux.getBlockByHash(HEX_ADDRESS)).rejects.toThrow('not match "hex64"');
  await expect(conflux.getBlockByHash(BLOCK_HASH, 0)).rejects.toThrow('not match "boolean"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getBlockByHash(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHash', BLOCK_HASH, false);

  await conflux.getBlockByHash(BLOCK_HASH, false);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHash', BLOCK_HASH, false);

  await conflux.getBlockByHash(BLOCK_HASH, true);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHash', BLOCK_HASH, true);

  call.mockRestore();
});

test('getBlockByHashWithPivotAssumption', async () => {
  await expect(conflux.getBlockByHashWithPivotAssumption()).rejects.toThrow('undefined not match "hex"');
  await expect(conflux.getBlockByHashWithPivotAssumption(BLOCK_HASH)).rejects.toThrow('undefined not match "hex"');
  await expect(conflux.getBlockByHashWithPivotAssumption(BLOCK_HASH, BLOCK_HASH)).rejects.toThrow('Cannot convert undefined to a BigInt');

  const epochNumber = 100;
  const blockHashArray = await conflux.getBlocksByEpochNumber(epochNumber);
  const blockHash = lodash.first(blockHashArray);
  const pivotHash = lodash.last(blockHashArray);

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getBlockByHashWithPivotAssumption(blockHash, pivotHash, epochNumber);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHashWithPivotAssumption', blockHash, pivotHash, '0x64');

  call.mockRestore();
});

test('getConfirmationRiskByHash', async () => {
  await expect(conflux.getConfirmationRiskByHash()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getConfirmationRiskByHash(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getConfirmationRiskByHash', BLOCK_HASH);

  call.mockRestore();
});

// ----------------------------- transaction --------------------------------
test('getTransactionByHash', async () => {
  await expect(conflux.getTransactionByHash()).rejects.toThrow('not match "hex"');
  await expect(conflux.getTransactionByHash(HEX_ADDRESS)).rejects.toThrow('not match "hex64"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getTransactionByHash(TX_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getTransactionByHash', TX_HASH);

  call.mockRestore();
});

test('getTransactionReceipt', async () => {
  await expect(conflux.getTransactionReceipt()).rejects.toThrow('not match "hex"');
  await expect(conflux.getTransactionReceipt(HEX_ADDRESS)).rejects.toThrow('not match "hex64"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getTransactionReceipt(TX_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getTransactionReceipt', TX_HASH);

  call.mockRestore();
});

test('sendRawTransaction', async () => {
  await expect(conflux.sendRawTransaction()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.sendRawTransaction('0x1ff');
  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0x01ff');

  await conflux.sendRawTransaction(Buffer.from([1, 255]));
  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0x01ff');

  call.mockRestore();
});

test('sendTransaction', async () => {
  const call = jest.spyOn(conflux.provider, 'call');
  await conflux.sendTransaction({
    from: ADDRESS,
    nonce: 100,
    gasPrice: '0x0abc',
    gas: 100,
    to: null,
    value: 0,
    storageLimit: 1000000,
    epochHeight: 200,
    chainId: 0,
    data: '0xabcd',
  }, PASSWORD);

  expect(call).toHaveBeenLastCalledWith('cfx_sendTransaction', {
    from: ADDRESS,
    nonce: '0x64',
    gasPrice: '0xabc',
    gas: '0x64',
    to: null,
    value: '0x0',
    storageLimit: '0xf4240',
    epochHeight: '0xc8',
    chainId: '0x0',
    data: '0xabcd',
  }, PASSWORD);

  call.mockRestore();
});

// ------------------------------ contract ----------------------------------
test('getCode', async () => {
  await expect(conflux.getCode()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getCode(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getCode', ADDRESS, undefined);

  await conflux.getCode(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getCode', ADDRESS, '0x0');

  call.mockRestore();
});

test('getCollateralForStorage', async () => {
  await expect(conflux.getCollateralForStorage()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getCollateralForStorage(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getCollateralForStorage', ADDRESS, undefined);

  await conflux.getCollateralForStorage(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getCollateralForStorage', ADDRESS, '0x0');

  call.mockRestore();
});

test('call', async () => {
  await expect(conflux.call()).rejects.toThrow('undefined');

  const call = jest.spyOn(conflux.provider, 'call');
  await conflux.call({ from: ADDRESS, to: ADDRESS });
  expect(call).toHaveBeenLastCalledWith('cfx_call', {
    from: ADDRESS,
    nonce: undefined,
    gasPrice: undefined,
    gas: undefined,
    storageLimit: undefined,
    to: ADDRESS,
    value: undefined,
    data: undefined,
    chainId: undefined,
    epochHeight: undefined,
  }, undefined);

  call.mockRestore();
});

test('estimateGasAndCollateral', async () => {
  await expect(conflux.estimateGasAndCollateral()).rejects.toThrow('undefined');

  const call = jest.spyOn(conflux.provider, 'call');
  await conflux.estimateGasAndCollateral({ to: ADDRESS });
  expect(call).toHaveBeenLastCalledWith('cfx_estimateGasAndCollateral', {
    from: undefined,
    nonce: undefined,
    gasPrice: undefined,
    gas: undefined,
    storageLimit: undefined,
    to: ADDRESS,
    value: undefined,
    data: undefined,
    chainId: undefined,
    epochHeight: undefined,
  }, undefined);

  await conflux.estimateGasAndCollateral(
    {
      from: ADDRESS,
      to: format.address(ADDRESS),
      gas: '0x01',
      chainId: '0x01',
      value: 100,
      data: '0x',
    },
  );
  expect(call).toHaveBeenLastCalledWith('cfx_estimateGasAndCollateral', {
    from: ADDRESS,
    nonce: undefined,
    gasPrice: undefined,
    gas: '0x1',
    storageLimit: undefined,
    to: ADDRESS,
    value: '0x64',
    data: '0x',
    chainId: '0x1',
    epochHeight: undefined,
  }, undefined);

  call.mockRestore();
});

test('getLogs', async () => {
  await expect(conflux.getLogs()).rejects.toThrow('Cannot read property');
  await expect(conflux.getLogs({ blockHashes: [], fromEpoch: 0 })).rejects.toThrow('OverrideError');
  await expect(conflux.getLogs({ topics: [[null]] })).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.getLogs({});
  expect(call).toHaveBeenLastCalledWith('cfx_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: undefined,
    blockHashes: undefined,
    topics: undefined,
    limit: undefined,
  });

  await conflux.getLogs({
    blockHashes: [BLOCK_HASH],
    address: ADDRESS,
    topics: [[TX_HASH], null],
    limit: 100,
  });
  expect(call).toHaveBeenLastCalledWith('cfx_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: ADDRESS,
    blockHashes: BLOCK_HASH,
    topics: [TX_HASH, null],
    limit: '0x64',
  });

  call.mockRestore();
});

// ------------------------------- subscribe ----------------------------------
test('subscribe', async () => {
  const id = await conflux.subscribe('epochs');

  expect(id).toMatch(/^0x[\da-f]+$/);
});

test('subscribeEpochs', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.subscribeEpochs();
  expect(call).toHaveBeenLastCalledWith('cfx_subscribe', 'epochs', 'latest_mined');

  call.mockRestore();
});

test('subscribeNewHeads', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.subscribeNewHeads();
  expect(call).toHaveBeenLastCalledWith('cfx_subscribe', 'newHeads');

  call.mockRestore();
});

test('subscribeLogs', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  await conflux.subscribeLogs();
  expect(call).toHaveBeenLastCalledWith('cfx_subscribe', 'logs', {});

  await conflux.subscribeLogs({
    address: ADDRESS,
    topics: [[TX_HASH], null],
  });
  expect(call).toHaveBeenLastCalledWith('cfx_subscribe', 'logs', {
    address: ADDRESS,
    topics: [TX_HASH, null],
  });

  call.mockRestore();
});

test('unsubscribe', async () => {
  const result = await conflux.unsubscribe('');

  expect(lodash.isBoolean(result)).toEqual(true);
});
