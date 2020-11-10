const providerFactory = require('../src/provider');

const HTTP_URL = 'http://main.confluxrpc.org';
const WS_URL = 'ws://main.confluxrpc.org/ws';

test('BaseProvider', async () => {
  const provider = providerFactory({});
  expect(provider.constructor.name).toEqual('BaseProvider');

  await expect(provider.call('cfx_epochNumber')).rejects.toThrow('BaseProvider.request not implement');

  expect(await provider.batch([])).toEqual([]);

  await expect(
    provider.batch([{ method: 'cfx_epochNumber' }, { method: 'NOT_EXIST' }]),
  ).rejects.toThrow('BaseProvider.requestBatch not implement');
}, 60 * 1000);

test('Invalid provider', () => {
  expect(() => providerFactory({ url: 'xxx' })).toThrow('Invalid provider options');
});

test.skip('HttpProvider', async () => {
  const provider = providerFactory({ url: HTTP_URL });
  expect(provider.constructor.name).toEqual('HttpProvider');

  await expect(provider.call('NOT_EXIST')).rejects.toThrow('Method not found');

  const result = await provider.call('cfx_epochNumber');
  expect(result).toMatch(/^0x[\da-f]+$/);

  const array = await provider.batch([{ method: 'cfx_epochNumber' }, { method: 'NOT_EXIST' }]);
  expect(array.length).toEqual(2);
  expect(array[0]).toMatch(/^0x[\da-f]+$/);
  expect(array[1].message).toMatch('Method not found');

  await provider.close();
}, 60 * 1000);

test.skip('WebSocketProvider', async () => {
  const provider = providerFactory({ url: WS_URL });
  expect(provider.constructor.name).toEqual('WebSocketProvider');

  const result = await provider.call('cfx_epochNumber');
  expect(result).toMatch(/^0x[\da-f]+$/);

  const array = await provider.batch([{ method: 'cfx_epochNumber' }]);
  expect(array.length).toEqual(1);
  expect(array[0]).toMatch(/^0x[\da-f]+$/);

  const id = await provider.call('cfx_subscribe', 'epochs');
  await new Promise(resolve => provider.once(id, resolve));

  const promise = provider.call('cfx_epochNumber');
  provider.close();
  provider.close();
  const error = await promise.catch(e => e);
  expect(error.message).toMatch(/Normal connection closure/);

  await new Promise(resolve => setTimeout(resolve, 1000));
}, 60 * 1000);
