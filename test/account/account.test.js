const { Conflux } = require('../../src');
const { MockProvider } = require('../../mock');
const PrivateKeyAccount = require('../../src/account/PrivateKeyAccount');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC_KEY = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
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
const conflux = new Conflux();
conflux.provider = new MockProvider();

test('conflux.Account({privateKey})', () => {
  expect(() => conflux.Account({})).toThrow('Invalid account options');

  const account = conflux.Account({ privateKey: PRIVATE_KEY });

  expect(account.conflux).not.toEqual(undefined);
  expect(account instanceof PrivateKeyAccount).toEqual(true);
  expect(account.privateKey).toEqual(PRIVATE_KEY);
  expect(account.publicKey).toEqual(PUBLIC_KEY);
  expect(account.address).toEqual(ADDRESS);
  expect(`${account}`).toEqual(ADDRESS);
  expect(JSON.stringify(account)).toEqual(JSON.stringify(ADDRESS));
});

test('conflux.Account({keystore,password})', () => {
  const account = conflux.Account({ keystore: KEYSTORE, password: PASSWORD });
  expect(account.privateKey).toEqual(PRIVATE_KEY);
  expect(account.address).toEqual(ADDRESS);
});

test('conflux.Account({random})', () => {
  const account1 = conflux.Account({ random: true });
  const account2 = conflux.Account({ random: true });

  expect(account1.privateKey).not.toEqual(account2.privateKey);
  expect(account1.address).not.toEqual(account2.address);
});

test('conflux.Account({random,entropy})', () => {
  const entropy = Buffer.allocUnsafe(32);
  const account1 = conflux.Account({ random: true, entropy });
  const account2 = conflux.Account({ random: true, entropy });

  expect(account1.privateKey).not.toEqual(account2.privateKey);
  expect(account1.address).not.toEqual(account2.address);
});
