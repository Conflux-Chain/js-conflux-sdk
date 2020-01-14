const Conflux = require('../src');
const MockProvider = require('../mock/MockProvider');

const cfx = new Conflux({
  defaultGas: 100,
  defaultGasPrice: 1000000,
});
cfx.provider = new MockProvider();

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const account = cfx.Account(KEY);

test('PendingTransaction', async () => {
  cfx.getTransactionByHash = jest.fn();
  cfx.getTransactionByHash
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ blockHash: 'blockHash' });

  cfx.getTransactionReceipt = jest.fn();
  cfx.getTransactionReceipt
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ outcomeStatus: 0, contractCreated: 'address' });

  cfx.getRiskCoefficient = jest.fn();
  cfx.getRiskCoefficient
    .mockResolvedValueOnce(1)
    .mockResolvedValue(0);

  const pending = cfx.sendTransaction({
    from: account,
  });

  expect((await pending).startsWith('0x')).toEqual(true);
  expect(await pending.mined({ delta: 0 })).toEqual({ blockHash: 'blockHash' });
  expect(await pending.executed({ delta: 0 })).toEqual({ outcomeStatus: 0, contractCreated: 'address' });
  expect(await pending.confirmed({ delta: 0 })).toEqual({ outcomeStatus: 0, contractCreated: 'address' });
});

test('PendingTransaction failed', async () => {
  cfx.getTransactionByHash = jest.fn();
  cfx.getTransactionByHash.mockResolvedValue({ blockHash: 'blockHash' });

  cfx.getTransactionReceipt = jest.fn();
  cfx.getTransactionReceipt.mockResolvedValue({ outcomeStatus: 1 });

  const pending = cfx.sendTransaction({
    from: account,
  });

  await expect(pending.confirmed({ delta: 0 })).rejects.toThrow('executed failed, outcomeStatus 1');
});

test('LogIterator wait epochNumber confirmed', async () => {
  cfx.getRiskCoefficient = jest.fn();
  cfx.getRiskCoefficient.mockResolvedValueOnce(1).mockResolvedValue(0);

  const iter = cfx.getLogs({ limit: 2 });
  expect(Boolean(await iter.next({ delta: 0 }))).toEqual(true);
  expect(Boolean(await iter.next({ delta: 0 }))).toEqual(true);
  expect(await iter.next()).toEqual(undefined);
  expect(cfx.getRiskCoefficient).toBeCalledTimes(2);
});

test('LogIterator toEpoch confirmed', async () => {
  cfx.getRiskCoefficient = () => 0;

  const iter = cfx.getLogs({ toEpoch: '0x00' });
  for await (const log of iter) {
    expect(Boolean(log)).toEqual(true);
  }
});
