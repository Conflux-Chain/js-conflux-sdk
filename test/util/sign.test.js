const lodash = require('lodash');
const { format, sign, CONST } = require('../../src');

const {
  checksumAddress,
  randomBuffer,
  randomPrivateKey,

  privateKeyToPublicKey,
  publicKeyToAddress,
  privateKeyToAddress,

  ecdsaSign,
  ecdsaRecover,
  encrypt,
  decrypt,
} = sign;

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';
const PASSWORD = 'password';

test('checksumAddress', () => {
  expect(checksumAddress('0XFB6916095CA1DF60BB79CE92CE3EA74C37C5D359'))
    .toEqual('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359');

  expect(checksumAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'))
    .toEqual('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359');
});

test('randomBuffer', () => {
  const buffer1 = randomBuffer(32);
  const buffer2 = randomBuffer(32);

  expect(buffer1.length).toEqual(32);
  expect(format.hex(buffer1).length).toEqual(2 + 64);
  expect(buffer1.equals(buffer2)).toEqual(false); // almost impossible
});

test('randomPrivateKey', () => {
  const key1 = format.privateKey(randomPrivateKey());
  const key2 = format.privateKey(randomPrivateKey());
  expect(key1).not.toEqual(key2); // almost impossible

  const entropy = format.hexBuffer('0x0123456789012345678901234567890123456789012345678901234567890123');
  const key3 = format.privateKey(randomPrivateKey(entropy));
  const key4 = format.privateKey(randomPrivateKey(entropy));
  expect(key3).not.toEqual(key4); // almost impossible

  const entropyInvalid = format.hexBuffer('0x0123456789');
  expect(() => randomPrivateKey(entropyInvalid)).toThrow('entropy must be 32 length Buffer');
});

test('privateKeyToPublicKey', () => {
  const publicKey = format.publicKey(privateKeyToPublicKey(format.hexBuffer(KEY)));
  expect(publicKey).toEqual(PUBLIC);
});

test('publicKeyToAddress', () => {
  const address = format.address(publicKeyToAddress(format.hexBuffer(PUBLIC)), CONST.TESTNET_ID);
  expect(address).toEqual(ADDRESS);
});

test('privateKeyToAddress', () => {
  const address = format.address(privateKeyToAddress(format.hexBuffer(KEY)), CONST.TESTNET_ID);
  expect(address).toEqual(ADDRESS);
});

test('encrypt and decrypt', () => {
  const keystore = encrypt(format.hexBuffer(KEY), PASSWORD);

  expect(keystore.version).toEqual(3);
  expect(lodash.isString(keystore.id)).toEqual(true);
  expect(/^[0-9a-f]{40}$/.test(keystore.address)).toEqual(true);
  expect(lodash.isPlainObject(keystore.crypto)).toEqual(true);
  expect(/^[0-9a-f]{64}$/.test(keystore.crypto.ciphertext)).toEqual(true);

  expect(lodash.isPlainObject(keystore.crypto.cipherparams)).toEqual(true);
  expect(/^[0-9a-f]{32}$/.test(keystore.crypto.cipherparams.iv)).toEqual(true);
  expect(keystore.crypto.cipher).toEqual('aes-128-ctr');
  expect(keystore.crypto.kdf).toEqual('scrypt');
  expect(lodash.isPlainObject(keystore.crypto.kdfparams)).toEqual(true);
  expect(keystore.crypto.kdfparams.dklen).toEqual(32);
  expect(/^[0-9a-f]{64}$/.test(keystore.crypto.kdfparams.salt)).toEqual(true);
  expect(keystore.crypto.kdfparams.n).toEqual(8192);
  expect(keystore.crypto.kdfparams.r).toEqual(8);
  expect(keystore.crypto.kdfparams.p).toEqual(1);
  expect(/^[0-9a-f]{64}$/.test(keystore.crypto.mac)).toEqual(true);

  const key = format.hex(decrypt(keystore, PASSWORD));
  expect(key).toEqual(KEY);

  expect(() => decrypt(keystore, 'WRONG_PASSWORD')).toThrow('Key derivation failed, possibly wrong password!');
});

test('ecdsaSign and ecdsaRecover', () => {
  const hash = randomBuffer(32);
  const { r, s, v } = ecdsaSign(hash, format.hexBuffer(KEY));

  expect(r.length).toEqual(32);
  expect(s.length).toEqual(32);
  expect(Number.isInteger(v)).toEqual(true);

  const publicKey = ecdsaRecover(hash, { r, s, v });
  const address = format.address(publicKeyToAddress(publicKey), CONST.TESTNET_ID);
  expect(address).toEqual(ADDRESS);
});
