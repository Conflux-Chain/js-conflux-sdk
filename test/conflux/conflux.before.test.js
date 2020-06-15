const lodash = require('lodash');
const { Conflux } = require('../../src');
const { MockProvider } = require('../../mock');
const format = require('../../src/util/format');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
const BLOCK_HASH = '0xe0b0000000000000000000000000000000000000000000000000000000000000';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const SEND_TX_PWD = '123456';

// ----------------------------------------------------------------------------
const cfx = new Conflux({
  defaultChainId: lodash.random(0, 10),
  defaultGas: lodash.random(0, 100),
  defaultGasPrice: lodash.random(0, 1000),
  defaultStorageLimit: lodash.random(0, 10000),
});
cfx.provider = new MockProvider();

beforeAll(() => {
  expect(cfx.defaultEpoch).toEqual('latest_state');
});

test('getLogs', async () => {
  await expect(cfx.getLogs()).rejects.toThrow('Cannot read property');
  await expect(cfx.getLogs({ blockHashes: [], fromEpoch: 0 })).rejects.toThrow('OverrideError');
  await expect(cfx.getLogs({ topics: [[null]] })).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getLogs({});
  expect(call).toHaveBeenLastCalledWith('cfx_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: undefined,
    blockHashes: undefined,
    topics: undefined,
    limit: undefined,
  });

  await cfx.getLogs({
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

test('getBalance', async () => {
  await expect(cfx.getBalance()).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getBalance(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getBalance', ADDRESS, cfx.defaultEpoch);

  await cfx.getBalance(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getBalance', ADDRESS, 'latest_state');

  await cfx.getBalance(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getBalance', ADDRESS, '0x0');

  call.mockRestore();
});

test('getNextNonce', async () => {
  await expect(cfx.getNextNonce()).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getNextNonce(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getNextNonce', ADDRESS, cfx.defaultEpoch);

  await cfx.getNextNonce(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('cfx_getNextNonce', ADDRESS, 'latest_state');

  await cfx.getNextNonce(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getNextNonce', ADDRESS, '0x0');

  call.mockRestore();
});

test('getBlocksByEpochNumber', async () => {
  await expect(cfx.getBlocksByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getBlocksByEpochNumber(0);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlocksByEpoch', '0x0');

  call.mockRestore();
});

test('getBlockByHash', async () => {
  await expect(cfx.getBlockByHash()).rejects.toThrow('not match hex');
  await expect(cfx.getBlockByHash(ADDRESS)).rejects.toThrow('not match hex');
  await expect(cfx.getBlockByHash(BLOCK_HASH, 0)).rejects.toThrow('not match boolean');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getBlockByHash(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHash', BLOCK_HASH, false);

  await cfx.getBlockByHash(BLOCK_HASH, false);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHash', BLOCK_HASH, false);

  await cfx.getBlockByHash(BLOCK_HASH, true);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHash', BLOCK_HASH, true);

  call.mockRestore();
});

test('getBlockByEpochNumber', async () => {
  await expect(cfx.getBlockByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');
  await expect(cfx.getBlockByEpochNumber(0, 1)).rejects.toThrow('not match boolean');

  const call = jest.spyOn(cfx.provider, 'call');
  call.mockReturnValue(null);

  await cfx.getBlockByEpochNumber('latest_state', false);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByEpochNumber', 'latest_state', false);

  await cfx.getBlockByEpochNumber(0, true);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByEpochNumber', '0x0', true);

  call.mockRestore();
});

test('getBlockByHashWithPivotAssumption', async () => {
  await expect(cfx.getBlockByHashWithPivotAssumption()).rejects.toThrow('undefined not match hex');
  await expect(cfx.getBlockByHashWithPivotAssumption(BLOCK_HASH)).rejects.toThrow('undefined not match hex');
  await expect(cfx.getBlockByHashWithPivotAssumption(BLOCK_HASH, BLOCK_HASH)).rejects.toThrow('Cannot convert undefined to a BigInt');

  const epochNumber = 100;
  const blockHashArray = await cfx.getBlocksByEpochNumber(epochNumber);
  const blockHash = lodash.first(blockHashArray);
  const pivotHash = lodash.last(blockHashArray);

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getBlockByHashWithPivotAssumption(blockHash, pivotHash, epochNumber);
  expect(call).toHaveBeenLastCalledWith('cfx_getBlockByHashWithPivotAssumption', blockHash, pivotHash, '0x64');

  call.mockRestore();
});

test('getConfirmationRiskByHash', async () => {
  await expect(cfx.getConfirmationRiskByHash()).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getConfirmationRiskByHash(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getConfirmationRiskByHash', BLOCK_HASH);

  call.mockRestore();
});

test('getTransactionByHash', async () => {
  await expect(cfx.getTransactionByHash()).rejects.toThrow('not match hex');
  await expect(cfx.getTransactionByHash(ADDRESS)).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getTransactionByHash(TX_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getTransactionByHash', TX_HASH);

  call.mockRestore();
});

test('getTransactionReceipt', async () => {
  await expect(cfx.getTransactionReceipt()).rejects.toThrow('not match hex');
  await expect(cfx.getTransactionReceipt(ADDRESS)).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getTransactionReceipt(TX_HASH);
  expect(call).toHaveBeenLastCalledWith('cfx_getTransactionReceipt', TX_HASH);

  call.mockRestore();
});

test('sendRawTransaction', async () => {
  await expect(cfx.sendRawTransaction()).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.sendRawTransaction('0x1ff');
  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0x01ff');

  await cfx.sendRawTransaction(Buffer.from([1, 255]));
  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0x01ff');

  call.mockRestore();
});

test('getCode', async () => {
  await expect(cfx.getCode()).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');

  await cfx.getCode(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('cfx_getCode', ADDRESS, cfx.defaultEpoch);

  await cfx.getCode(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('cfx_getCode', ADDRESS, '0x0');

  call.mockRestore();
});

test('call', async () => {
  await expect(cfx.call()).rejects.toThrow('Cannot read property');
  await expect(cfx.call({ nonce: 0 })).rejects.toThrow('not match hex'); // miss to

  const call = jest.spyOn(cfx.provider, 'call');
  await cfx.call({ to: ADDRESS });
  expect(call).toHaveBeenLastCalledWith('cfx_call', {
    from: undefined,
    nonce: undefined,
    gasPrice: format.hexUInt(cfx.defaultGasPrice),
    gas: format.hexUInt(cfx.defaultGas),
    storageLimit: format.hexUInt(cfx.defaultStorageLimit),
    to: ADDRESS,
    value: undefined,
    data: undefined,
    chainId: cfx.defaultChainId,
    epochHeight: undefined,
  }, cfx.defaultEpoch);

  call.mockRestore();
});

test('call by AUTO', async () => {
  const call = jest.spyOn(cfx.provider, 'call');

  const getNextNonce = jest.spyOn(cfx, 'getNextNonce');
  getNextNonce.mockReturnValue(100);

  await cfx.call(
    {
      from: format.buffer(ADDRESS),
      to: format.buffer(ADDRESS),
      nonce: 0,
      // chainId: 1,
      gas: '2',
      gasPrice: 3,
      storageLimit: 4,
      epochHeight: 5,
      value: 100,
      data: '0x',
    },
    'latest_mined',
  );
  expect(call).toHaveBeenLastCalledWith('cfx_call', {
    from: ADDRESS,
    nonce: '0x0',
    chainId: cfx.defaultChainId,
    gas: '0x2',
    gasPrice: '0x3',
    storageLimit: '0x4',
    epochHeight: 5,
    to: ADDRESS,
    value: '0x64',
    data: '0x',
  }, 'latest_mined');

  getNextNonce.mockRestore();
  call.mockRestore();
});

test('estimateGasAndCollateral', async () => {
  await expect(cfx.estimateGasAndCollateral()).rejects.toThrow('Cannot read property');

  const call = jest.spyOn(cfx.provider, 'call');
  await cfx.estimateGasAndCollateral({ to: ADDRESS });
  expect(call).toHaveBeenLastCalledWith('cfx_estimateGasAndCollateral', {
    from: undefined,
    nonce: undefined,
    gasPrice: format.hexUInt(cfx.defaultGasPrice),
    gas: format.hexUInt(cfx.defaultGas),
    storageLimit: format.hexUInt(cfx.defaultStorageLimit),
    to: ADDRESS,
    value: undefined,
    data: undefined,
    chainId: cfx.defaultChainId,
    epochHeight: undefined,
  });

  const getNextNonce = jest.spyOn(cfx, 'getNextNonce');
  getNextNonce.mockReturnValue(100);

  await cfx.estimateGasAndCollateral(
    {
      from: ADDRESS,
      to: format.buffer(ADDRESS),
      gas: '0x01',
      value: 100,
      data: '0x',
    },
  );
  expect(call).toHaveBeenLastCalledWith('cfx_estimateGasAndCollateral', {
    from: ADDRESS,
    nonce: '0x64',
    gasPrice: format.hexUInt(cfx.defaultGasPrice),
    gas: '0x1',
    storageLimit: format.hexUInt(cfx.defaultStorageLimit),
    to: ADDRESS,
    value: '0x64',
    data: '0x',
    chainId: cfx.defaultChainId,
    epochHeight: undefined,
  });

  getNextNonce.mockRestore();
  call.mockRestore();
});

test('sendTransaction by DEFAULT', async () => {
  await expect(cfx.sendTransaction()).rejects.toThrow('Cannot read property');
  await expect(cfx.sendTransaction({ nonce: 0 })).rejects.toThrow('not match hex');

  const call = jest.spyOn(cfx.provider, 'call');
  await cfx.sendTransaction({ from: ADDRESS, epochHeight: 200, nonce: 100 }, SEND_TX_PWD);
  expect(call).toHaveBeenLastCalledWith('send_transaction', {
    from: ADDRESS,
    nonce: '0x64',
    gasPrice: format.hexUInt(cfx.defaultGasPrice),
    gas: format.hexUInt(cfx.defaultGas),
    to: undefined,
    value: undefined,
    data: undefined,
    chainId: format.hexUInt(cfx.defaultChainId),
    epochHeight: format.hex(200),
    storageLimit: format.hexUInt(cfx.defaultStorageLimit),
  }, SEND_TX_PWD);

  call.mockRestore();
});

test('sendTransaction by AUTO', async () => {
  const call = jest.spyOn(cfx.provider, 'call');

  const defaultStorageLimit = cfx.defaultStorageLimit;
  cfx.defaultStorageLimit = undefined;

  const defaultGasPrice = cfx.defaultGasPrice;
  cfx.defaultGasPrice = undefined;

  const defaultGas = cfx.defaultGas;
  cfx.defaultGas = undefined;

  const defaultChainId = cfx.defaultChainId;
  cfx.defaultChainId = undefined;

  const getEpochNumber = jest.spyOn(cfx, 'getEpochNumber');
  getEpochNumber.mockReturnValue(1000);

  const getGasPrice = jest.spyOn(cfx, 'getGasPrice');
  getGasPrice.mockReturnValue(0);

  const getStatus = jest.spyOn(cfx, 'getStatus');
  getStatus.mockReturnValue({ chainId: format.uInt(1) });

  const getNextNonce = jest.spyOn(cfx, 'getNextNonce');
  getNextNonce.mockReturnValue(100);

  const estimateGasAndCollateral = jest.spyOn(cfx, 'estimateGasAndCollateral');
  estimateGasAndCollateral.mockReturnValue({
    gasUsed: format.bigUInt(1024),
    storageCollateralized: format.bigUInt(2048),
  });

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('send_transaction');
    return TX_HASH;
  };

  await cfx.sendTransaction({
    from: ADDRESS,
    to: format.buffer(ADDRESS),
    value: 0,
    data: '0x',
  }, SEND_TX_PWD);
  expect(call).toHaveBeenLastCalledWith('send_transaction', {
    from: ADDRESS,
    nonce: '0x64',
    gasPrice: '0x1',
    gas: '0x400',
    to: ADDRESS,
    value: '0x0',
    data: '0x',
    chainId: format.hexUInt(1),
    epochHeight: format.hexUInt(1000),
    storageLimit: format.hexUInt(2048),
  }, SEND_TX_PWD);

  expect(getEpochNumber).toHaveBeenCalledTimes(1);
  expect(getNextNonce).toHaveBeenCalledTimes(1);
  expect(getStatus).toHaveBeenCalledTimes(1);
  expect(getGasPrice).toHaveBeenCalledTimes(1);
  expect(estimateGasAndCollateral).toHaveBeenCalledTimes(1);

  cfx.defaultStorageLimit = defaultStorageLimit;
  cfx.defaultGasPrice = defaultGasPrice;
  cfx.defaultGas = defaultGas;
  cfx.defaultChainId = defaultChainId;
  getEpochNumber.mockRestore();
  getStatus.mockRestore();
  getNextNonce.mockRestore();
  estimateGasAndCollateral.mockRestore();
  call.mockRestore();
});

test('sendTransaction by account', async () => {
  const account = cfx.Account(KEY);

  const call = jest.spyOn(cfx.provider, 'call');
  await cfx.sendTransaction({
    from: account,
    chainId: 0,
    epochHeight: 200,
    nonce: 100,
    gas: 100,
    gasPrice: 1000000,
    storageLimit: 1000000,
  });
  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0xf854d064830f4240648080830f424081c8808001a04687443e9d1886f1c5d0ab48c6fc5d254eaea7d8ab9839be1143cf1645d0d6a7a0272248475dbf1b624dbe9758afe2ec1cfd82a194ce170b9362f95d5b4a07f48e');

  call.mockRestore();
});
