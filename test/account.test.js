const lodash = require('lodash');
const { Account } = require('../src');
const { randomPrivateKey, sha3, ecdsaSign } = require('../src/util/sign');
const format = require('../src/util/format');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';

const signerCollection = address => {
  if (address !== ADDRESS) {
    return () => {};
  }
  return async tx => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return ecdsaSign(sha3(tx.encode(false)), format.buffer(KEY));
  };
};

test('Account(privateKey)', () => {
  const account = new Account(KEY);
  expect(account.privateKey).toEqual(KEY);
  expect(account.publicKey).toEqual(PUBLIC);
  expect(account.address).toEqual(ADDRESS);
  expect(account.signer).toEqual(undefined);
});

test('Account(publicKey)', () => {
  const account = new Account(PUBLIC);
  expect(account.privateKey).toEqual(undefined);
  expect(account.publicKey).toEqual(PUBLIC);
  expect(account.address).toEqual(ADDRESS);
  expect(account.signer).toEqual(undefined);
});

test('Account(address)', () => {
  const account = new Account(ADDRESS);
  expect(account.privateKey).toEqual(undefined);
  expect(account.publicKey).toEqual(undefined);
  expect(account.address).toEqual(ADDRESS);
  expect(account.signer).toEqual(undefined);
});

test('Account(address with signerCollection)', () => {
  const account = new Account(ADDRESS, signerCollection);
  expect(account.privateKey).toEqual(undefined);
  expect(account.publicKey).toEqual(undefined);
  expect(account.address).toEqual(ADDRESS);
});

test('Account(0x)', () => {
  expect(() => new Account('0x')).toThrow('unexpected hex length');
});

test('Account.signTransaction', async () => {
  const account = new Account(KEY);

  const tx = await account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 });
  expect(tx.from).toEqual(ADDRESS);

  account.privateKey = randomPrivateKey();
  await expect(account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 }))
    .rejects
    .toThrow('transaction.from !==');
});

test('Account.signMessage', async () => {
  const account = new Account(KEY);

  const message = await account.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);
  expect(message.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01');

  account.privateKey = randomPrivateKey();
  await expect(account.signMessage('Hello World'))
    .rejects
    .toThrow('message.from !==');
});

test('Account.signTransaction using signerCollection', async () => {
  const account = new Account(ADDRESS, signerCollection);

  const tx = await account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 });
  expect(tx.from).toEqual(ADDRESS);

  const randomAddress = Account.random().address;
  account.address = randomAddress;
  await expect(account.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 }))
    .rejects
    .toThrow('transaction.from !==');

  const randomAccount = new Account(randomAddress, signerCollection);
  await expect(randomAccount.signTransaction({ nonce: 0, gasPrice: 100, gas: 10000, storageLimit: 10000, epochHeight: 100, chainId: 0 }))
    .rejects
    .toThrow('No signature is returned from the signer.');
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
  const keystoreV3 = account.encrypt('password');

  expect(keystoreV3.crypto).toEqual(keystoreV3.crypto);
  expect(keystoreV3.crypto).not.toEqual(account.encrypt('password').crypto);

  const loadAccount = Account.decrypt(keystoreV3, 'password');

  expect(loadAccount.privateKey).toEqual(account.privateKey);
  expect(loadAccount.address).toEqual(account.address);
});

test('encrypt', () => {
  const account = new Account(KEY);

  const keystoreV3 = account.encrypt('password');

  expect(keystoreV3.version).toEqual(3);
  expect(lodash.isString(keystoreV3.id)).toEqual(true);
  expect(format.address(keystoreV3.address)).toEqual(keystoreV3.address);
  expect(lodash.isPlainObject(keystoreV3.crypto)).toEqual(true);
  expect(/^[0-9a-f]{64}$/.test(keystoreV3.crypto.ciphertext)).toEqual(true);

  expect(lodash.isPlainObject(keystoreV3.crypto.cipherparams)).toEqual(true);
  expect(/^[0-9a-f]{32}$/.test(keystoreV3.crypto.cipherparams.iv)).toEqual(true);
  expect(keystoreV3.crypto.cipher).toEqual('aes-128-ctr');
  expect(keystoreV3.crypto.kdf).toEqual('scrypt');
  expect(lodash.isPlainObject(keystoreV3.crypto.kdfparams)).toEqual(true);
  expect(keystoreV3.crypto.kdfparams.dklen).toEqual(32);
  expect(/^[0-9a-f]{64}$/.test(keystoreV3.crypto.kdfparams.salt)).toEqual(true);
  expect(keystoreV3.crypto.kdfparams.n).toEqual(8192);
  expect(keystoreV3.crypto.kdfparams.r).toEqual(8);
  expect(keystoreV3.crypto.kdfparams.p).toEqual(1);
  expect(/^[0-9a-f]{64}$/.test(keystoreV3.crypto.mac)).toEqual(true);
});

test('decrypt', () => {
  const keystoreV3 = {
    version: 3,
    id: 'db029583-f1bd-41cc-aeb5-b2ed5b33227b',
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: '3198706577b0880234ecbb5233012a8ca0495bf2cfa2e45121b4f09434187aba',
      cipherparams: { iv: 'a9a1f9565fd9831e669e8a9a0ec68818' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: '3ce2d51bed702f2f31545be66fa73d1467d24686059776430df9508407b74231',
        n: 8192,
        r: 8,
        p: 1,
      },
      mac: 'cf73832f328f3d5d1e0ec7b0f9c220facf951e8bba86c9f26e706d2df1e34890',
    },
  };

  const account = Account.decrypt(keystoreV3, 'password');
  expect(account.privateKey).toEqual(KEY);
  expect(account.address).toEqual(keystoreV3.address);

  expect(() => Account.decrypt({ ...keystoreV3, version: 0 }, 'password')).toThrow('Not a valid V3 wallet');
});
