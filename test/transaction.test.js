const { Transaction } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';

test('Transaction', () => {
  const tx = new Transaction({
    nonce: 0,
    gasPrice: 1,
    gas: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
    storageLimit: 0,
    epochHeight: 0,
  });

  expect(tx.nonce).toEqual(0);
  expect(tx.gasPrice).toEqual(1);
  expect(tx.gas).toEqual(21000);
  expect(tx.to).toEqual('0x0123456789012345678901234567890123456789');
  expect(tx.value).toEqual(0);
  expect(tx.storageLimit).toEqual(0);
  expect(tx.epochHeight).toEqual(0);
  expect(tx.data).toEqual(undefined);
  expect(tx.r).toEqual(undefined);
  expect(tx.s).toEqual(undefined);
  expect(tx.v).toEqual(undefined);
  expect(tx.from).toEqual(undefined); // virtual attribute
  expect(tx.hash).toEqual(undefined); // virtual attribute

  tx.sign(KEY);

  expect(tx.r).toEqual('0xa370e3562713fb50513ff5d77f18a7dffe7588d3d05413d28211e300a262c7ee');
  expect(tx.s).toEqual('0x784961a41aba10dfd5d97193d6c35bfc50a15030254bc91ae5a85df6d79d77b1');
  expect(tx.v).toEqual(0);
  expect(tx.from).toEqual(ADDRESS);
  expect(tx.hash).toEqual('0x42bed0d43b492261eee4b1c59a4fcd3a2fa7bc7cc1cd208469d0075f0f0a2e7d');
  expect(tx.recover()).toEqual('0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559');
  expect(tx.serialize()).toEqual('0xf863df8001825208940123456789012345678901234567890123456789808080808080a0a370e3562713fb50513ff5d77f18a7dffe7588d3d05413d28211e300a262c7eea0784961a41aba10dfd5d97193d6c35bfc50a15030254bc91ae5a85df6d79d77b1');

  tx.value = 1;
  expect(tx.from).not.toEqual(ADDRESS);
});
