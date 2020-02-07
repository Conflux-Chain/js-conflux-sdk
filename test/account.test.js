const { Account } = require('../src');
const { randomPrivateKey } = require('../src/util/sign');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

test('Account', () => {
  const account = new Account(KEY);
  expect(account.privateKey).toEqual(KEY);
  expect(account.publicKey).toEqual(PUBLIC);
  expect(account.address).toEqual(ADDRESS);
});

test('Account.signTransaction', () => {
  const account = new Account(KEY);

  const tx = account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000 });
  expect(tx.from).toEqual(ADDRESS);

  account.privateKey = randomPrivateKey();
  expect(() => account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000 })).toThrow('transaction.from !==');
});

test('Account.signMessage', () => {
  const account = new Account(KEY);

  const message = account.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);
  expect(message.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101');

  account.privateKey = randomPrivateKey();
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
