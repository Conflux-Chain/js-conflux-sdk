const Wallet = require('../src/wallet');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

// ----------------------------------------------------------------------------
test('Wallet', () => {
  const wallet = new Wallet();
  expect(wallet.size).toEqual(0);

  const accountNew = wallet.create();
  expect(wallet.size).toEqual(1);

  const accountGet = wallet.get(accountNew.address);
  expect(accountGet.address).toEqual(accountNew.address);
  expect(accountGet.privateKey).toEqual(accountNew.privateKey);

  const accountAdd = wallet.add(KEY);
  expect(wallet.size).toEqual(2);
  expect(accountAdd.privateKey).toEqual(KEY);
  expect(accountAdd.address).toEqual(ADDRESS);

  const accountDup = wallet.add(KEY);
  expect(wallet.size).toEqual(2);
  expect(accountAdd.address).toEqual(accountDup.address);
  expect(accountAdd.privateKey).toEqual(accountDup.privateKey);

  const accountRemove = wallet.remove(accountNew.address);
  expect(accountRemove.address).toEqual(accountNew.address);
  expect(accountRemove.privateKey).toEqual(accountNew.privateKey);
  expect(wallet.size).toEqual(1);

  const empty = wallet.remove(accountNew.address);
  expect(empty).toEqual(undefined);
  expect(wallet.size).toEqual(1);

  wallet.clear(accountNew.address);
  expect(wallet.size).toEqual(0);
});

test('Wallet.Account', () => {
  const account = new Wallet.Account(KEY);
  expect(account.privateKey).toEqual(KEY);
  expect(account.address).toEqual(ADDRESS);

  const tx = account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000 });
  expect(tx.from).toEqual(ADDRESS);
  account.address = '0x0000000000000000000000000000000000000000';
  expect(() => account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000 })).toThrow('transaction.from !==');

  // const info = account.encrypt('password');
  // const loadAccount = Wallet.Account.decrypt(info, 'password');
  //
  // expect(loadAccount.privateKey).toEqual(account.privateKey);
  // expect(loadAccount.address).toEqual(account.address);
});
