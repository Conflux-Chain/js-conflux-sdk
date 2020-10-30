const { Conflux } = require('../../src');
const MockProvider = require('../../mock/MockProvider');

const conflux = new Conflux({
  defaultGasPrice: 1000000,
});
conflux.provider = new MockProvider();

test('PendingTransaction', async () => {
  const getTransactionByHash = jest.spyOn(conflux, 'getTransactionByHash');
  getTransactionByHash
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ blockHash: 'blockHash' });

  const getTransactionReceipt = jest.spyOn(conflux, 'getTransactionReceipt');
  getTransactionReceipt
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ outcomeStatus: 0, contractCreated: 'address' });

  const getConfirmationRiskByHash = jest.spyOn(conflux, 'getConfirmationRiskByHash');
  getConfirmationRiskByHash
    .mockResolvedValueOnce(1)
    .mockResolvedValue(0);

  const pending = conflux.sendRawTransaction('0x');

  expect((await pending).startsWith('0x')).toEqual(true);
  expect(await pending.mined({ delta: 0 })).toEqual({ blockHash: 'blockHash' });
  expect(await pending.executed({ delta: 0 })).toEqual({ outcomeStatus: 0, contractCreated: 'address' });
  expect(await pending.confirmed({ delta: 0 })).toEqual({ outcomeStatus: 0, contractCreated: 'address' });

  getTransactionByHash.mockRestore();
  getTransactionReceipt.mockRestore();
  getConfirmationRiskByHash.mockRestore();
});

test('PendingTransaction failed', async () => {
  conflux.getTransactionByHash = jest.fn();
  conflux.getTransactionByHash.mockResolvedValue({ blockHash: 'blockHash' });

  conflux.getTransactionReceipt = jest.fn();
  conflux.getTransactionReceipt.mockResolvedValue({ outcomeStatus: 1 });

  const pending = conflux.sendRawTransaction('0x');

  await expect(pending.confirmed()).rejects.toThrow('executed failed, outcomeStatus 1');
});

test('PendingTransaction catch', async () => {
  const call = jest.spyOn(conflux.provider, 'call');

  const hash = await conflux.sendRawTransaction('0x').catch(v => v);
  expect(hash).toMatch(/0x.{64}/);

  call.mockRejectedValueOnce(new Error('XXX'));
  const e = await conflux.sendRawTransaction('0x').catch(v => v);
  expect(e.message).toEqual('XXX');

  call.mockRestore();
});

test('PendingTransaction finally', async () => {
  const call = jest.spyOn(conflux.provider, 'call');
  let called;

  called = false;
  await conflux.sendRawTransaction('0x').finally(() => {
    called = true;
  });
  expect(called).toEqual(true);

  called = false;
  call.mockRejectedValueOnce(new Error('XXX'));
  await expect(
    conflux.sendRawTransaction('0x').finally(() => {
      called = true;
    }),
  ).rejects.toThrow('XXX');
  expect(called).toEqual(true);

  call.mockRestore();
});
