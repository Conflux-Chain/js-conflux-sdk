const { Account } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

test('Account', () => {
  const account = new Account(KEY);
  expect(account.privateKey).toEqual(KEY);
  expect(account.address).toEqual(ADDRESS);
});

test('Account.signTransaction', () => {
  const account = new Account(KEY);

  const tx = account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000 });
  expect(tx.from).toEqual(ADDRESS);

  account.address = '0x0000000000000000000000000000000000000000';
  expect(() => account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000 })).toThrow('transaction.from !==');
});

test('Account.signMessage', () => {
  const account = new Account(KEY);

  const message = account.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);

  account.address = '0x0000000000000000000000000000000000000000';
  expect(() => account.signMessage('Hello World')).toThrow('message.from !==');
});

test('Account.random', () => {
  const account1 = Account.random();
  const account2 = Account.random();
  expect(account1.privateKey).not.toEqual(KEY);
  expect(account1.privateKey).not.toEqual(account2.privateKey);

  const entropy = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  const account3UseEntropy = Account.random(entropy);
  const account4UseEntropy = Account.random(entropy);
  expect(account3UseEntropy.privateKey).not.toEqual(KEY);
  expect(account3UseEntropy.privateKey).not.toEqual(account4UseEntropy.privateKey);
});

// test('encrypt and decrypt', () => {
//   const account = new Account(KEY);
//
//   const info = account.encrypt('password');
//   const loadAccount = Account.decrypt(info, 'password');
//
//   expect(loadAccount.privateKey).toEqual(account.privateKey);
//   expect(loadAccount.address).toEqual(account.address);
// });
