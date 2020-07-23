const { Conflux } = require('../../src');
const { sign, format } = require('../../src/util');
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

test('PrivateKeyAccount.random', () => {
  const account1 = PrivateKeyAccount.random();
  const account2 = PrivateKeyAccount.random();
  expect(account1.privateKey).not.toEqual(PRIVATE_KEY);
  expect(account1.privateKey).not.toEqual(account2.privateKey);

  const entropy = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  const account3UseEntropy = PrivateKeyAccount.random(entropy);
  const account4UseEntropy = PrivateKeyAccount.random(entropy);
  expect(account3UseEntropy.privateKey).not.toEqual(PRIVATE_KEY);
  expect(account3UseEntropy.privateKey).not.toEqual(account4UseEntropy.privateKey);
});

test('PrivateKeyAccount.decrypt', () => {
  const account = PrivateKeyAccount.decrypt(KEYSTORE, PASSWORD);
  expect(account.privateKey).toEqual(PRIVATE_KEY);
  expect(account.publicKey).toEqual(PUBLIC_KEY);
  expect(account.address).toEqual(ADDRESS);
  expect(account.conflux).toEqual(undefined);
});

test('PrivateKeyAccount.constructor', () => {
  expect(() => new PrivateKeyAccount('0x')).toThrow('private key length is invalid');

  const account = new PrivateKeyAccount(PRIVATE_KEY);
  expect(account.privateKey).toEqual(PRIVATE_KEY);
  expect(account.publicKey).toEqual(PUBLIC_KEY);
  expect(account.address).toEqual(ADDRESS);
  expect(`${account}`).toEqual(ADDRESS);
  expect(account.conflux).toEqual(undefined);
});

test('encrypt', () => {
  const account = new PrivateKeyAccount(PRIVATE_KEY);
  const keystore = account.encrypt(PASSWORD);
  expect(account.encrypt(PASSWORD).crypto).not.toEqual(keystore.crypto);

  expect(keystore.version).toEqual(3);
  expect(`0x${keystore.address}`).toEqual(account.address);
});

test('signMessage', async () => {
  const account = new PrivateKeyAccount(PRIVATE_KEY);

  const message = await account.signMessage('Hello World');
  expect(message.from).toEqual(ADDRESS);
  expect(message.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01');

  account.privateKey = sign.randomPrivateKey();
  expect(() => account.signMessage('Hello World')).toThrow('Invalid sign message.from');
});

test('signTransaction', async () => {
  const account = new PrivateKeyAccount(PRIVATE_KEY);

  const options = {
    nonce: 0,
    gasPrice: 100,
    gas: 10000,
    storageLimit: 10000,
    epochHeight: 100,
    chainId: 0,
  };

  const transaction = await account.signTransaction(options);
  expect(transaction.from).toEqual(ADDRESS);

  account.privateKey = sign.randomPrivateKey();
  expect(() => account.signTransaction(options)).toThrow('Invalid sign transaction.from');
});

// ----------------------------------------------------------------------------
test('sendTransaction', async () => {
  const account = new PrivateKeyAccount(PRIVATE_KEY, conflux);

  const call = jest.spyOn(conflux.provider, 'call');

  await account.sendTransaction({
    nonce: 100,
    gasPrice: 10,
    gas: format.bigUInt(1024),
    to: ADDRESS,
    value: 0,
    storageLimit: format.bigUInt(2048),
    epochHeight: 1000,
    chainId: 1,
    data: undefined,
  });

  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0xf867e3640a820400941cad0b19bb29d4674531d6f115237e16afce377c808208008203e8018080a07408093a0a059d285f8b064e41ebca856c5c2369af32ebcdadb0b5e2446d9eaea043624cf0731d4ad618ef055a95cef1e05708b7b45e675205be9d050581820afc');

  call.mockRestore();
});

test('sendTransaction AUTO', async () => {
  const account = new PrivateKeyAccount(PRIVATE_KEY, conflux);

  const getNextNonce = jest.spyOn(conflux, 'getNextNonce');
  getNextNonce.mockReturnValue(100);

  const getGasPrice = jest.spyOn(conflux, 'getGasPrice');
  getGasPrice.mockReturnValue(10);

  const getEpochNumber = jest.spyOn(conflux, 'getEpochNumber');
  getEpochNumber.mockReturnValue(1000);

  const getStatus = jest.spyOn(conflux, 'getStatus');
  getStatus.mockReturnValue({ chainId: format.uInt(1) });

  const estimateGasAndCollateral = jest.spyOn(conflux, 'estimateGasAndCollateral');
  estimateGasAndCollateral.mockReturnValue({
    gasUsed: format.bigUInt(1024),
    storageCollateralized: format.bigUInt(2048),
  });

  const signTransaction = jest.spyOn(account, 'signTransaction');
  const call = jest.spyOn(conflux.provider, 'call');

  await account.sendTransaction({ to: ADDRESS, value: 0 });

  expect(getNextNonce).toHaveBeenCalledTimes(1);
  expect(getGasPrice).toHaveBeenCalledTimes(1);
  expect(getEpochNumber).toHaveBeenCalledTimes(1);
  expect(getStatus).toHaveBeenCalledTimes(1);
  expect(estimateGasAndCollateral).toHaveBeenCalledTimes(1);
  expect(signTransaction).toHaveBeenLastCalledWith({
    from: account.address,
    nonce: 100,
    gasPrice: 10,
    gas: format.bigUInt(1024),
    to: ADDRESS,
    value: 0,
    storageLimit: format.bigUInt(2048),
    epochHeight: 1000,
    chainId: 1,
    data: undefined,
  });
  expect(call).toHaveBeenLastCalledWith('cfx_sendRawTransaction', '0xf867e3640a820400941cad0b19bb29d4674531d6f115237e16afce377c808208008203e8018080a07408093a0a059d285f8b064e41ebca856c5c2369af32ebcdadb0b5e2446d9eaea043624cf0731d4ad618ef055a95cef1e05708b7b45e675205be9d050581820afc');

  call.mockRestore();
  signTransaction.mockRestore();
  estimateGasAndCollateral.mockRestore();
  getStatus.mockRestore();
  getEpochNumber.mockRestore();
  getGasPrice.mockRestore();
  getNextNonce.mockRestore();
});
