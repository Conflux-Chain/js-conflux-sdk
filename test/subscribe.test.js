const { Conflux } = require('../src');
const MockProvider = require('../mock/MockProvider');

const conflux = new Conflux({
  defaultGasPrice: 1000000,
});
conflux.provider = new MockProvider();

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const account = conflux.Account({ privateKey: PRIVATE_KEY });

test('PendingTransaction', async () => {
  conflux.getTransactionByHash = jest.fn();
  conflux.getTransactionByHash
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ blockHash: 'blockHash' });

  conflux.getTransactionReceipt = jest.fn();
  conflux.getTransactionReceipt
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ outcomeStatus: 0, contractCreated: 'address' });

  conflux.getConfirmationRiskByHash = jest.fn();
  conflux.getConfirmationRiskByHash
    .mockResolvedValueOnce(1)
    .mockResolvedValue(0);

  const pending = account.sendTransaction({});

  expect((await pending).startsWith('0x')).toEqual(true);
  expect(await pending.mined({ delta: 0 })).toEqual({ blockHash: 'blockHash' });
  expect(await pending.executed({ delta: 0 })).toEqual({ outcomeStatus: 0, contractCreated: 'address' });
  expect(await pending.confirmed({ delta: 0 })).toEqual({ outcomeStatus: 0, contractCreated: 'address' });
});

test('PendingTransaction failed', async () => {
  conflux.getTransactionByHash = jest.fn();
  conflux.getTransactionByHash.mockResolvedValue({ blockHash: 'blockHash' });

  conflux.getTransactionReceipt = jest.fn();
  conflux.getTransactionReceipt.mockResolvedValue({ outcomeStatus: 1 });

  const pending = account.sendTransaction({});

  await expect(pending.confirmed({ delta: 0 })).rejects.toThrow('executed failed, outcomeStatus 1');
});
