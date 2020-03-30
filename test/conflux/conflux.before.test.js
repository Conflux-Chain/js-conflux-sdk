const { Conflux } = require('../../src');
const { MockProvider } = require('../../mock');
const format = require('../../src/util/format');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
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
  expect(cfx.defaultEpoch).toEqual('latest_state');
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
    expect(options.blockHashes).toEqual(BLOCK_HASH);
    expect(options.address).toEqual(ADDRESS);
    expect(options.topics).toEqual([TX_HASH, null]);
    expect(options.limit).toEqual('0x64');
    return [];
  };
  await cfx.getLogs({
    blockHashes: [BLOCK_HASH],
    address: ADDRESS,
    topics: [[TX_HASH], null],
    limit: 100,
  });

  await expect(cfx.getLogs({ blockHashes: [], fromEpoch: 0 })).rejects.toThrow('OverrideError');
  await expect(cfx.getLogs({ topics: [[null]] })).rejects.toThrow('not match hex');
});

test('getBalance', async () => {
  await expect(cfx.getBalance()).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getBalance');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual(cfx.defaultEpoch);
    return '0x0';
  };
  await cfx.getBalance(ADDRESS);
  await cfx.getBalance(ADDRESS, 'latest_state');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getBalance');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual('0x0');
    return '0x0';
  };
  await cfx.getBalance(ADDRESS, 0);
});

test('getTransactionCount', async () => {
  await expect(cfx.getTransactionCount()).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getTransactionCount');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual(cfx.defaultEpoch);
    return '0x0';
  };
  await cfx.getTransactionCount(ADDRESS);
  await cfx.getTransactionCount(ADDRESS, 'latest_state');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getTransactionCount');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual('0x0');
    return '0x0';
  };
  await cfx.getTransactionCount(ADDRESS, 0);
});

test('getBlocksByEpochNumber', async () => {
  await expect(cfx.getBlocksByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');

  cfx.provider.call = async (method, epochNumber) => {
    expect(method).toEqual('cfx_getBlocksByEpoch');
    expect(epochNumber).toEqual('0x0');
  };
  await cfx.getBlocksByEpochNumber(0);
});

test('getBlockByHash', async () => {
  await expect(cfx.getBlockByHash()).rejects.toThrow('not match hex');
  await expect(cfx.getBlockByHash(ADDRESS)).rejects.toThrow('not match hex');
  await expect(cfx.getBlockByHash(BLOCK_HASH, 0)).rejects.toThrow('not match boolean');

  cfx.provider.call = async (method, blockHash, detail) => {
    expect(method).toEqual('cfx_getBlockByHash');
    expect(blockHash).toEqual(BLOCK_HASH);
    expect(detail).toEqual(false);
    return null;
  };
  await cfx.getBlockByHash(BLOCK_HASH);
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
  await expect(cfx.getBlockByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');
  await expect(cfx.getBlockByEpochNumber(0, 1)).rejects.toThrow('not match boolean');

  cfx.provider.call = async (method, epochNumber, detail) => {
    expect(method).toEqual('cfx_getBlockByEpochNumber');
    expect(epochNumber).toEqual(cfx.defaultEpoch);
    expect(detail).toEqual(false);
    return null;
  };
  await cfx.getBlockByEpochNumber('latest_state');
  await cfx.getBlockByEpochNumber('latest_state', false);

  cfx.provider.call = async (method, epochNumber, detail) => {
    expect(method).toEqual('cfx_getBlockByEpochNumber');
    expect(epochNumber).toEqual('0x0');
    expect(detail).toEqual(true);
    return null;
  };
  await cfx.getBlockByEpochNumber(0, true);
});

test('getBlockByHashWithPivotAssumption', async () => {
  // TODO
});

test('getRiskCoefficient', async () => {
  // TODO
});

test('getTransactionByHash', async () => {
  await expect(cfx.getTransactionByHash()).rejects.toThrow('not match hex');
  await expect(cfx.getTransactionByHash(ADDRESS)).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toEqual('cfx_getTransactionByHash');
    expect(txHash).toEqual(TX_HASH);
    return null;
  };
  await cfx.getTransactionByHash(TX_HASH);
});

test('getTransactionReceipt', async () => {
  await expect(cfx.getTransactionReceipt()).rejects.toThrow('not match hex');
  await expect(cfx.getTransactionReceipt(ADDRESS)).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toEqual('cfx_getTransactionReceipt');
    expect(txHash).toEqual(TX_HASH);
    return null;
  };
  await cfx.getTransactionReceipt(TX_HASH);
});

test('sendRawTransaction', async () => {
  await expect(cfx.sendRawTransaction()).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, txHash) => {
    expect(method).toEqual('cfx_sendRawTransaction');
    expect(txHash).toEqual('0x01ff');
    return TX_HASH;
  };
  await cfx.sendRawTransaction('0x01ff');
  await cfx.sendRawTransaction(Buffer.from([1, 255]));
});

test('getCode', async () => {
  await expect(cfx.getCode()).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getCode');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual(cfx.defaultEpoch);
  };
  await cfx.getCode(ADDRESS);
  await cfx.getCode(ADDRESS, cfx.defaultEpoch);

  cfx.provider.call = async (method, address, epochNumber) => {
    expect(method).toEqual('cfx_getCode');
    expect(address).toEqual(ADDRESS);
    expect(epochNumber).toEqual('0x0');
  };
  await cfx.getCode(ADDRESS, 0);
});

test('call', async () => {
  cfx.getTransactionCount = async address => {
    expect(format.hex(address)).toEqual(ADDRESS);
    return 100;
  };

  await expect(cfx.call()).rejects.toThrow('Cannot read property');
  await expect(cfx.call({ nonce: 0 })).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, options, epochNumber) => {
    expect(method).toEqual('cfx_call');

    expect(options.from).toEqual(undefined);
    expect(options.nonce).toEqual(undefined);
    expect(options.gasPrice).toEqual(format.numberHex(cfx.defaultGasPrice));
    expect(options.gas).toEqual(format.numberHex(cfx.defaultGas));
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
    expect(options.gasPrice).toEqual(format.numberHex(cfx.defaultGasPrice));
    expect(options.gas).toEqual('0x1');
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual('0x64');
    expect(options.data).toEqual('0x');

    expect(epochNumber).toEqual('latest_mined');
  };
  await cfx.call(
    {
      from: format.buffer(ADDRESS),
      to: format.buffer(ADDRESS),
      gas: '1',
      value: 100,
      data: '0x',
    },
    'latest_mined',
  );
});

test('estimateGasAndCollateral', async () => {
  cfx.getTransactionCount = async address => {
    expect(format.hex(address)).toEqual(ADDRESS);
    return 100;
  };

  await expect(cfx.estimateGasAndCollateral()).rejects.toThrow('Cannot read property');

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_estimateGasAndCollateral');

    expect(options.from).toEqual(undefined);
    expect(options.nonce).toEqual(undefined);
    expect(options.gasPrice).toEqual(format.numberHex(cfx.defaultGasPrice));
    expect(options.gas).toEqual(format.numberHex(cfx.defaultGas));
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual(undefined);
    expect(options.data).toEqual(undefined);
    return {
      gasUsed: '0x0',
      storageOccupied: '0x0',
    };
  };
  await cfx.estimateGasAndCollateral({ to: ADDRESS });

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_estimateGasAndCollateral');

    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x64');
    expect(options.gasPrice).toEqual(format.numberHex(cfx.defaultGasPrice));
    expect(options.gas).toEqual('0x1');
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual('0x64');
    expect(options.data).toEqual('0x');
    return {
      gasUsed: '0x1',
      storageOccupied: '0x0',
    };
  };
  await cfx.estimateGasAndCollateral(
    {
      from: format.buffer(ADDRESS),
      to: format.buffer(ADDRESS),
      gas: '0x01',
      value: 100,
      data: '0x',
    },
  );
});

test('sendTransaction by address', async () => {
  cfx.getTransactionCount = async address => {
    expect(address).toEqual(ADDRESS);
    return 0;
  };

  cfx.estimateGasAndCollateral = async () => {
    return {
      gasUsed: format.bigUInt(1024),
      storageOccupied: format.bigUInt(2048),
    };
  };

  cfx.getEpochNumber = async () => {
    return 1000;
  };

  await expect(cfx.sendTransaction()).rejects.toThrow('Cannot read property');
  await expect(cfx.sendTransaction({ nonce: 0 })).rejects.toThrow('not match hex');

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_sendTransaction');
    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x0');
    expect(options.gasPrice).toEqual(format.numberHex(cfx.defaultGasPrice));
    expect(options.gas).toEqual(format.numberHex(cfx.defaultGas));
    expect(options.to).toEqual(undefined);
    expect(options.value).toEqual(undefined);
    expect(options.data).toEqual(undefined);
    return TX_HASH;
  };
  await cfx.sendTransaction({ from: ADDRESS });
  await cfx.sendTransaction({ nonce: 0, from: ADDRESS });

  cfx.provider.call = async (method, options) => {
    expect(method).toEqual('cfx_sendTransaction');
    expect(options.from).toEqual(ADDRESS);
    expect(options.nonce).toEqual('0x64');
    expect(options.gasPrice).toEqual(format.numberHex(cfx.defaultGasPrice));
    expect(options.gas).toEqual('0x1');
    expect(options.to).toEqual(ADDRESS);
    expect(options.value).toEqual('0x0');
    expect(options.data).toEqual('0x');
    return TX_HASH;
  };
  await cfx.sendTransaction({
    nonce: 100,
    from: ADDRESS,
    to: format.buffer(ADDRESS),
    gas: 1,
    value: 0,
    data: '0x',
  });
});

test('sendTransaction by account', async () => {
  const account = cfx.Account(KEY);

  cfx.getTransactionCount = async address => {
    expect(format.hex(address)).toEqual(ADDRESS);
    return 0;
  };

  cfx.estimateGasAndCollateral = async () => {
    return {
      gasUsed: format.bigUInt(0),
      storageOccupied: format.bigUInt(2048),
    };
  };

  cfx.getEpochNumber = async () => {
    return 1000;
  };

  cfx.provider.call = async (method, hex) => {
    expect(method).toEqual('cfx_sendRawTransaction');
    expect(hex.startsWith('0x')).toEqual(true);
    return TX_HASH;
  };
  await cfx.sendTransaction({ from: account });
});
