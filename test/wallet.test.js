const { Conflux, sign, CONST } = require('../src');
const BaseAccount = require('../src/wallet/Account');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC_KEY = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';
const PASSWORD = 'password';

const KEYSTORE = {
  version: 3,
  id: 'db029583-f1bd-41cc-aeb5-b2ed5b33227b',
  address: '1cad0b19bb29d4674531d6f115237e16afce377c',
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

// ----------------------------------------------------------------------------
const conflux = new Conflux({
  networkId: CONST.TESTNET_ID,
});

afterEach(() => {
  conflux.wallet.clear();
});

// ----------------------------------------------------------------------------
test('set', async () => {
  const account = new BaseAccount(ADDRESS);

  conflux.wallet.set(ADDRESS, account);
  expect(conflux.wallet.has(ADDRESS)).toEqual(true);
  expect(conflux.wallet.has(ADDRESS)).toEqual(true);

//   const ERROR_ADDRESS = `${ADDRESS.substr(0, 20)}${ADDRESS.substr(20).toUpperCase()}`;
//   expect(() => conflux.wallet.set(ERROR_ADDRESS, account)).toThrow('checksum error');
});

test('set not BaseAccount', async () => {
  expect(() => conflux.wallet.set(ADDRESS, null)).toThrow('not instance of Account');
});

test('set already exist', async () => {
  const account = new BaseAccount(ADDRESS);

  conflux.wallet.set(ADDRESS, account);
  expect(() => conflux.wallet.set(ADDRESS, account)).toThrow('already has account');

  conflux.wallet.delete(ADDRESS);
  conflux.wallet.set(ADDRESS, account);
  expect(conflux.wallet.has(ADDRESS)).toEqual(true);
});

test('addPrivateKey', async () => {
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY, CONST.TESTNET_ID);
  expect(conflux.wallet.has(ADDRESS)).toEqual(true);

  expect(account.privateKey).toEqual(PRIVATE_KEY);
  expect(account.publicKey).toEqual(PUBLIC_KEY);
  expect(account.address).toEqual(ADDRESS);
  expect(JSON.stringify(account)).toEqual(JSON.stringify(ADDRESS));
});

test('addKeystore', async () => {
  const account = conflux.wallet.addKeystore(KEYSTORE, PASSWORD, CONST.TESTNET_ID);
  expect(conflux.wallet.has(ADDRESS)).toEqual(true);

  expect(account.privateKey).toEqual(PRIVATE_KEY);
  expect(account.publicKey).toEqual(PUBLIC_KEY);
  expect(account.address).toEqual(ADDRESS);
});

test('addRandom', async () => {
  const account1 = conflux.wallet.addRandom();
  const account2 = conflux.wallet.addRandom();

  expect(account1.privateKey).not.toEqual(account2.privateKey);
  expect(account1.address).not.toEqual(account2.address);
});

test('addRandom same entropy', async () => {
  const entropy = Buffer.allocUnsafe(32);
  const account1 = conflux.wallet.addRandom(entropy);
  const account2 = conflux.wallet.addRandom(entropy);

  expect(account1.privateKey).not.toEqual(account2.privateKey);
  expect(account1.address).not.toEqual(account2.address);
});

// ----------------------------------------------------------------------------
test('account.encrypt', () => {
  const account1 = conflux.wallet.addPrivateKey(PRIVATE_KEY, CONST.TESTNET_ID);

  const keystore = account1.encrypt(PASSWORD);
  const account2 = account1.constructor.decrypt(keystore, PASSWORD, CONST.TESTNET_ID);

  expect(account1.privateKey).toEqual(account2.privateKey);
  expect(account1.address).toEqual(account2.address);
});

// ----------------------------------------------------------------------------
test('signTransaction', async () => {
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY, CONST.TESTNET_ID);

  const options = {
    nonce: 0,
    gasPrice: 100,
    gas: 10000,
    storageLimit: 10000,
    epochHeight: 100,
    chainId: 1,
  };

  const transaction = await account.signTransaction(options);
  expect(transaction.from).toEqual(ADDRESS);

  account.privateKey = sign.randomPrivateKey();
  await expect(account.signTransaction(options)).rejects.toThrow('Invalid sign transaction.from');
});

test('signMessage', async () => {
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY, CONST.TESTNET_ID);

  const message = await account.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);
});
