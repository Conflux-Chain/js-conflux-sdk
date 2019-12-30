const BigNumber = require('bignumber.js');
const { Hex, EpochNumber } = require('../../src/utils/type');

const Conflux = require('../../src');
const MockProvider = require('../__mocks__/MockProvider');

const KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393';
const ADDRESS = '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b';
const BLOCK_HASH = '0xe0b0000000000000000000000000000000000000000000000000000000000000';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const DEFAULT_GAS = 100;
const DEFAULT_GAS_PRICE = 1000000;

// ----------------------------------------------------------------------------
const cfx = new Conflux({
  defaultGas: DEFAULT_GAS,
  defaultGasPrice: DEFAULT_GAS_PRICE,
});
cfx.provider = new MockProvider();

beforeAll(() => {
  expect(cfx.defaultEpoch).toEqual(EpochNumber.LATEST_STATE);
  expect(cfx.defaultGas).toEqual(DEFAULT_GAS);
  expect(cfx.defaultGasPrice).toEqual(DEFAULT_GAS_PRICE);
});

test('getLogs', async () => {
  await expect(cfx.getLogs()).rejects.toThrow('Cannot read property');

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_getLogs');
    expect(options.fromEpoch).toEqual(undefined);
    expect(options.toEpoch).toEqual(undefined);
    expect(options.blockHashes).toEqual(undefined);
    expect(options.address).toEqual(undefined);
    expect(options.topics).toEqual(undefined);
    expect(options.limit).toEqual(undefined);
    return [];
  };
  await cfx.getLogs({});

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_getLogs');
    expect(options.fromEpoch).toEqual(undefined);
    expect(options.toEpoch).toEqual(undefined);
    expect(options.blockHashes).toEqual([BLOCK_HASH]);
    expect(options.address).toEqual(ADDRESS);
    expect(options.topics).toEqual([[TX_HASH], null]);
    expect(options.limit).toEqual('0x64');
    return [];
  };
  await cfx.getLogs({
    blockHashes: [BLOCK_HASH],
    address: ADDRESS,
    topics: [[TX_HASH], null],
    limit: 100,
  });

  await expect(cfx.getLogs({ blockHashes: [], fromEpoch: 0 })).rejects.toThrow('Override waring');
  await expect(cfx.getLogs({ topics: [[null]] })).rejects.toThrow('do not match Hex32');
});

test('getBalance', async () => {
  await expect(cfx.getBalance()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getBalance');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual(cfx.defaultEpoch);
    return '0x0';
  };
  await cfx.getBalance(ADDRESS);
  await cfx.getBalance(ADDRESS.replace('0x', ''));
  await cfx.getBalance(ADDRESS, EpochNumber.LATEST_STATE);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getBalance');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual('0x00');
    return '0x0';
  };
  await cfx.getBalance(ADDRESS, 0);
});

test('getTransactionCount', async () => {
  await expect(cfx.getTransactionCount()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getTransactionCount');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual(cfx.defaultEpoch);
    return '0x0';
  };
  await cfx.getTransactionCount(ADDRESS);
  await cfx.getTransactionCount(ADDRESS.replace('0x', ''));
  await cfx.getTransactionCount(ADDRESS, EpochNumber.LATEST_STATE);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getTransactionCount');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual('0x00');
    return '0x0';
  };
  await cfx.getTransactionCount(ADDRESS, 0);
});

test('getBlocksByEpochNumber', async () => {
  await expect(cfx.getBlocksByEpochNumber()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, epochNumber) => {
    expect(method).toEqual('cfx_getBlocksByEpoch');
    expect(epochNumber).toEqual('0x00');
  };
  await cfx.getBlocksByEpochNumber(0);
});

test('getBlockByHash', async () => {
  await expect(cfx.getBlockByHash()).rejects.toThrow('do not match BlockHash');
  await expect(cfx.getBlockByHash(ADDRESS)).rejects.toThrow('do not match BlockHash');
  await expect(cfx.getBlockByHash(BLOCK_HASH, 0)).rejects.toThrow('detail must be boolean');

  cfx.provider.call = async (method, blockHash, detail) => {
    expect(method).toEqual('cfx_getBlockByHash');
    expect(blockHash).toEqual(BLOCK_HASH);
    expect(detail).toEqual(false);
    return null;
  };
  await cfx.getBlockByHash(BLOCK_HASH);
  await cfx.getBlockByHash(BLOCK_HASH.replace('0x', ''));
  await cfx.getBlockByHash(BLOCK_HASH, false);

  cfx.provider.call = async (method, blockHash, detail) => {
    expect(method).toEqual('cfx_getBlockByHash');
    expect(blockHash).toEqual(BLOCK_HASH);
    expect(detail).toEqual(true);
    return null;
  };
  await cfx.getBlockByHash(BLOCK_HASH, true);
});

test('getBlockByEpochNumber', async () => {
  await expect(cfx.getBlockByEpochNumber()).rejects.toThrow('do not match hex string');
  await expect(cfx.getBlockByEpochNumber(0, 1)).rejects.toThrow('detail must be boolean');

  cfx.provider.call = async (method, epochNumber, detail) => {
    expect(method).toEqual('cfx_getBlockByEpochNumber');
    expect(epochNumber).toEqual(cfx.defaultEpoch);
    expect(detail).toEqual(false);
    return null;
  };
  await cfx.getBlockByEpochNumber(EpochNumber.LATEST_STATE);
  await cfx.getBlockByEpochNumber(EpochNumber.LATEST_STATE, false);

  cfx.provider.call = async (method, epochNumber, detail) => {
    expect(method).toEqual('cfx_getBlockByEpochNumber');
    expect(epochNumber).toEqual('0x00');
    expect(detail).toEqual(true);
    return null;
  };
  await cfx.getBlockByEpochNumber(0, true);
  await cfx.getBlockByEpochNumber('0', true);
});

test('getBlockByHashWithPivotAssumption', async () => {
  // TODO
});

test('getRiskCoefficient', async () => {
  // TODO
});

test('getTransactionByHash', async () => {
  await expect(cfx.getTransactionByHash()).rejects.toThrow('do not match TxHash');
  await expect(cfx.getTransactionByHash(ADDRESS)).rejects.toThrow('do not match TxHash');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toEqual('cfx_getTransactionByHash');
    expect(txHash).toEqual(TX_HASH);
    return null;
  };
  await cfx.getTransactionByHash(TX_HASH);
  await cfx.getTransactionByHash(TX_HASH.replace('0x', ''));
});

test('getTransactionReceipt', async () => {
  await expect(cfx.getTransactionReceipt()).rejects.toThrow('do not match TxHash');
  await expect(cfx.getTransactionReceipt(ADDRESS)).rejects.toThrow('do not match TxHash');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toEqual('cfx_getTransactionReceipt');
    expect(txHash).toEqual(TX_HASH);
    return null;
  };
  await cfx.getTransactionReceipt(TX_HASH);
  await cfx.getTransactionReceipt(TX_HASH.replace('0x', ''));
});

test('sendTransaction by address', async () => {
  cfx.getTransactionCount = async address => {
    expect(address).toEqual(ADDRESS);
    return 0;
  };

  await expect(cfx.sendTransaction()).rejects.toThrow('Cannot read property');
  await expect(cfx.sendTransaction({ nonce: 0 })).rejects.toThrow('\'from\' is required and should match \'Address\'');

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_sendTransaction');
    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x00');
    expect(options.gasPrice).toEqual(Hex(cfx.defaultGasPrice));
    expect(options.gas).toEqual(Hex(cfx.defaultGas));
    expect(options.to).toEqual(undefined);
    expect(options.value).toEqual(undefined);
    expect(options.data).toEqual('0x');
    return TX_HASH;
  };
  await cfx.sendTransaction({ from: ADDRESS });
  await cfx.sendTransaction({ nonce: 0, from: ADDRESS });

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_sendTransaction');
    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x64');
    expect(options.gasPrice).toEqual(Hex(cfx.defaultGasPrice));
    expect(options.gas).toEqual('0x01');
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual('0x00');
    expect(options.data).toEqual('0x');
    return TX_HASH;
  };
  await cfx.sendTransaction({
    nonce: '100',
    from: ADDRESS.replace('0x', ''),
    to: Hex.toBuffer(ADDRESS),
    gas: BigNumber(1),
    value: 0,
    data: '',
  });
});

test('sendTransaction by account', async () => {
  const account = cfx.wallet.add(KEY);

  cfx.getTransactionCount = async address => {
    expect(Hex(address)).toEqual(ADDRESS);
    return 0;
  };

  cfx.provider.call = async (method, hex) => {
    expect(method).toEqual('cfx_sendRawTransaction');
    expect(Hex.isHex(hex)).toEqual(true);
    return TX_HASH;
  };
  await cfx.sendTransaction({ from: account });
});

test('sendRawTransaction', async () => {
  await expect(cfx.sendRawTransaction()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toEqual('cfx_sendRawTransaction');
    expect(txHash).toEqual('0x01ff');
    return TX_HASH;
  };
  await cfx.sendRawTransaction('01ff');
  await cfx.sendRawTransaction(Buffer.from([1, 255]));
});

test('getCode', async () => {
  await expect(cfx.getCode()).rejects.toThrow('do not match hex string');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getCode');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual(cfx.defaultEpoch);
  };
  await cfx.getCode(ADDRESS);
  await cfx.getCode(ADDRESS.replace('0x', ''));
  await cfx.getCode(ADDRESS, cfx.defaultEpoch);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getCode');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual('0x00');
  };
  await cfx.getCode(ADDRESS, 0);
});

test('call', async () => {
  cfx.getTransactionCount = async address => {
    expect(Hex(address)).toEqual(ADDRESS);
    return 100;
  };

  await expect(cfx.call()).rejects.toThrow('Cannot read property');
  await expect(cfx.call({ nonce: 0 })).rejects.toThrow('\'to\' is required and should match \'Address\'');

  cfx.provider.call = async (method, options, epochNumber) => {
    expect(method).toEqual('cfx_call');

    expect(options.from).toEqual(undefined);
    expect(options.nonce).toEqual(undefined);
    expect(options.gasPrice).toEqual(Hex(cfx.defaultGasPrice));
    expect(options.gas).toEqual(Hex(cfx.defaultGas));
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual(undefined);
    expect(options.data).toEqual(undefined);

    expect(epochNumber).toEqual(cfx.defaultEpoch);
  };
  await cfx.call({ to: ADDRESS });

  cfx.provider.call = async (method, options, epochNumber) => {
    expect(method).toEqual('cfx_call');

    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x64');
    expect(options.gasPrice).toEqual(Hex(cfx.defaultGasPrice));
    expect(options.gas).toEqual('0x01');
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual('0x64');
    expect(options.data).toEqual('0x');

    expect(epochNumber).toEqual(EpochNumber.LATEST_MINED);
  };
  await cfx.call(
    {
      from: Hex.toBuffer(ADDRESS),
      to: Hex.toBuffer(ADDRESS),
      gas: BigNumber(1),
      value: '100',
      data: '',
    },
    EpochNumber.LATEST_MINED,
  );
});

test('estimateGas', async () => {
  cfx.getTransactionCount = async address => {
    expect(Hex(address)).toEqual(ADDRESS);
    return 100;
  };

  await expect(cfx.estimateGas()).rejects.toThrow('Cannot read property');

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_estimateGas');

    expect(options.from).toEqual(undefined);
    expect(options.nonce).toEqual(undefined);
    expect(options.gasPrice).toEqual(Hex(cfx.defaultGasPrice));
    expect(options.gas).toEqual(Hex(cfx.defaultGas));
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual(undefined);
    expect(options.data).toEqual(undefined);
    return '0x0'
  };
  await cfx.estimateGas({ to: ADDRESS });

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_estimateGas');

    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x64');
    expect(options.gasPrice).toEqual(Hex(cfx.defaultGasPrice));
    expect(options.gas).toEqual('0x01');
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual('0x64');
    expect(options.data).toEqual('0x');
    return '0x0'
  };
  await cfx.estimateGas(
    {
      from: Hex.toBuffer(ADDRESS),
      to: Hex.toBuffer(ADDRESS),
      gas: BigNumber(1),
      value: '100',
      data: '',
    },
  );
});
