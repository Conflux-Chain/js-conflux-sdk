const Transaction = require('../src/Transaction');

const ADDRESS = '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b';
const KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393';

test('Transaction', () => {
  const tx = new Transaction({
    nonce: 0,
    gasPrice: 1,
    gas: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
  });

  expect(tx.nonce).toEqual('0x00');
  expect(tx.gasPrice).toEqual('0x01');
  expect(tx.gas).toEqual('0x5208');
  expect(tx.to).toEqual('0x0123456789012345678901234567890123456789');
  expect(tx.value).toEqual('0x00');
  expect(tx.data).toEqual('0x');
  expect(tx.r).toEqual(undefined);
  expect(tx.s).toEqual(undefined);
  expect(tx.v).toEqual(undefined);
  expect(tx.from).toEqual(undefined); // virtual attribute
  expect(tx.hash).toEqual(undefined); // virtual attribute

  tx.sign(KEY);

  expect(tx.r).toEqual('0x1fdeea421319a30193d3250779a0edfaac79f9bb0556b523d8e4f9cba85543e2');
  expect(tx.s).toEqual('0x28c6e13c055fe689b540b921b8a2cd944738367c8eeecd18400560e11b4c6a4f');
  expect(tx.v).toEqual('0x01');
  expect(tx.from).toEqual(ADDRESS);
  expect(tx.hash).toEqual('0xcf9eec4364c30176207e8972acfb358fb29b05569835125c458b94839651a724');
  expect(tx.serialize()).toEqual('0xf85f8001825208940123456789012345678901234567890123456789808001a01fdeea421319a30193d3250779a0edfaac79f9bb0556b523d8e4f9cba85543e2a028c6e13c055fe689b540b921b8a2cd944738367c8eeecd18400560e11b4c6a4f');

  tx.value = '0x01';
  expect(tx.from).not.toEqual(ADDRESS);
});

test('sendOptions', () => {
  expect(() => Transaction.sendOptions()).toThrow('Cannot destructure property');
  expect(() => Transaction.sendOptions({})).toThrow('\'from\' is required and should match \'Address\'');
  expect(() => Transaction.sendOptions({ from: ADDRESS })).toThrow('\'nonce\' is required and should match \'uint\'');
  expect(() => Transaction.sendOptions({ nonce: 0, from: ADDRESS })).toThrow('\'gasPrice\' is required and should match \'Drip\'');
  expect(() => Transaction.sendOptions({ nonce: 0, from: ADDRESS, gasPrice: 1 }))
    .toThrow('\'gas\' is required and should match \'uint\'');

  const tx = Transaction.sendOptions({ nonce: 0, from: ADDRESS, gasPrice: 1, gas: 21000 });
  expect(tx.from).toEqual(ADDRESS);
  expect(tx.nonce).toEqual('0x00');
  expect(tx.gasPrice).toEqual('0x01');
  expect(tx.gas).toEqual('0x5208');
  expect(tx.to).toEqual(undefined);
  expect(tx.value).toEqual(undefined);
  expect(tx.data).toEqual('0x');
});

test('callOptions', () => {
  expect(() => Transaction.callOptions()).toThrow('Cannot destructure property');
  expect(() => Transaction.callOptions({})).toThrow('\'to\' is required and should match \'Address\'');

  const tx = Transaction.callOptions({ to: ADDRESS });
  expect(tx.from).toEqual(undefined);
  expect(tx.nonce).toEqual(undefined);
  expect(tx.gasPrice).toEqual(undefined);
  expect(tx.gas).toEqual(undefined);
  expect(tx.to).toEqual(ADDRESS);
  expect(tx.value).toEqual(undefined);
  expect(tx.data).toEqual(undefined);
});

test('estimateOptions', () => {
  expect(() => Transaction.estimateOptions()).toThrow('Cannot destructure property');

  const tx = Transaction.estimateOptions({});
  expect(tx.from).toEqual(undefined);
  expect(tx.nonce).toEqual(undefined);
  expect(tx.gasPrice).toEqual(undefined);
  expect(tx.gas).toEqual(undefined);
  expect(tx.to).toEqual(undefined);
  expect(tx.value).toEqual(undefined);
  expect(tx.data).toEqual(undefined);
});

test('rawOptions', () => {
  expect(() => Transaction.rawOptions()).toThrow('Cannot destructure property');
  expect(() => Transaction.rawOptions({})).toThrow('\'nonce\' is required and should match \'uint\'');
  expect(() => Transaction.rawOptions({ nonce: 0 })).toThrow('\'gasPrice\' is required and should match \'Drip\'');
  expect(() => Transaction.rawOptions({ nonce: 0, gasPrice: 1 })).toThrow('\'gas\' is required and should match \'uint\'');

  const tx = Transaction.rawOptions({ nonce: 0, gasPrice: 1, gas: 21000 });
  expect(tx.nonce).toEqual('0x00');
  expect(tx.gasPrice).toEqual('0x01');
  expect(tx.gas).toEqual('0x5208');
  expect(tx.to).toEqual('0x');
  expect(tx.value).toEqual('0x00');
  expect(tx.data).toEqual('0x');
  expect(tx.r).toEqual(undefined);
  expect(tx.s).toEqual(undefined);
  expect(tx.v).toEqual(undefined);
});
