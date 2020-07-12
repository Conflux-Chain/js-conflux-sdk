const { Account, AccountWithSigProvider } = require('../src');
const { randomPrivateKey } = require('../src/util/sign');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';

const sigProvider = address => {
  return async tx => {
    if (address !== ADDRESS) {
      throw new Error(`Fail to sign for address ${address}`);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    tx.sign(KEY);
    return tx;
  };
};

test('Account(privateKey)', () => {
  const account = new Account(KEY);
  expect(account.privateKey).toEqual(KEY);
  expect(account.publicKey).toEqual(PUBLIC);
  expect(account.address).toEqual(ADDRESS);
});

test('Account(publicKey)', () => {
  const account = new Account(PUBLIC);
  expect(account.privateKey).toEqual(undefined);
  expect(account.publicKey).toEqual(PUBLIC);
  expect(account.address).toEqual(ADDRESS);
});

test('Account(address)', () => {
  const account = new Account(ADDRESS);
  expect(account.privateKey).toEqual(undefined);
  expect(account.publicKey).toEqual(undefined);
  expect(account.address).toEqual(ADDRESS);
});

test('Account(0x)', () => {
  expect(() => new Account('0x')).toThrow('unexpected hex length');
});

test('Account.signTransaction', () => {
  const account = new Account(KEY);

  const tx = account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 });
  expect(tx.from).toEqual(ADDRESS);

  account.privateKey = randomPrivateKey();
  expect(() => account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 }))
    .toThrow('transaction.from !==');
});

test('Account.signMessage', () => {
  const account = new Account(KEY);

  const message = account.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);
  expect(message.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01');

  account.privateKey = randomPrivateKey();
  expect(() => account.signMessage('Hello World')).toThrow('message.from !==');
});

test('AccountWithSigProvider.signTransaction', async () => {
  const accountWithSigProvider = new AccountWithSigProvider(ADDRESS, sigProvider);

  const tx = await accountWithSigProvider.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 });
  expect(tx.from).toEqual(ADDRESS);

  const randomAddress = Account.random().address;
  accountWithSigProvider.address = randomAddress;
  await expect(accountWithSigProvider.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 }))
    .rejects
    .toThrow(`Fail to sign for address ${randomAddress}`);
});

test('AccountWithSigProvider.signMessage', async () => {
  const accountWithSigProvider = new AccountWithSigProvider(ADDRESS, sigProvider);

  const message = await accountWithSigProvider.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);
  expect(message.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01');

  const randomAddress = Account.random().address;
  accountWithSigProvider.address = randomAddress;
  await expect(accountWithSigProvider.signMessage('Hello World'))
    .rejects
    .toThrow(`Fail to sign for address ${randomAddress}`);
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

test('encrypt and decrypt', () => {
  const account = new Account(KEY);

  expect(account.encrypt('password').salt).not.toEqual(account.encrypt('password').salt);

  const info = account.encrypt('password');
  const loadAccount = Account.decrypt('password', info);

  expect(loadAccount.privateKey).toEqual(account.privateKey);
  expect(loadAccount.address).toEqual(account.address);
});
