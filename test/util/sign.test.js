const format = require('../../src/util/format');

const {
  sha3,
  checksumAddress,
  randomBuffer,
  randomPrivateKey,
  privateKeyToAddress,
  ecdsaSign,
  ecdsaRecover,
  // encrypt,
  // decrypt,
} = require('../../src/util/sign');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

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

  const entropy = format.buffer('0x0123456789012345678901234567890123456789012345678901234567890123');
  const key3 = format.privateKey(randomPrivateKey(entropy));
  const key4 = format.privateKey(randomPrivateKey(entropy));
  expect(key3).not.toEqual(key4); // almost impossible

  const entropyInvalid = format.buffer('0x0123456789');
  expect(() => randomPrivateKey(entropyInvalid)).toThrow('entropy must be 32 length Buffer');
});

test('privateKeyToAddress', () => {
  const address = format.address(privateKeyToAddress(format.buffer(KEY)));
  expect(address).toEqual(ADDRESS);
});

// test('encrypt and decrypt', () => {
//   const { salt, iv, cipher, mac } = encrypt(format.buffer(KEY), Buffer.from('password'));
//
//   expect(salt.length).toEqual(32);
//   expect(iv.length).toEqual(16);
//   expect(cipher.length).toEqual(32);
//   expect(mac.length).toEqual(32);
//
//   const key = format.hex(decrypt({ salt, iv, cipher, mac }, Buffer.from('password')));
//   expect(key).toEqual(KEY);
// });

test('ecdsaSign and ecdsaRecover', () => {
  const hash = randomBuffer(32);
  const { r, s, v } = ecdsaSign(hash, format.buffer(KEY));

  expect(r.length).toEqual(32);
  expect(s.length).toEqual(32);
  expect(Number.isInteger(v)).toEqual(true);

  const publicKey = ecdsaRecover(hash, { r, s, v });
  const address = format.hex(sha3(publicKey).slice(-20));
  expect(address).toEqual(ADDRESS);
});
