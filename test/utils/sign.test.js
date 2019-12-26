const { Hex, PrivateKey, Address } = require('../../src/utils/type');
const {
  sha3,
  randomBuffer,
  randomPrivateKey,
  privateKeyToAddress,
  ecdsaSign,
  ecdsaRecover,
  // encrypt,
  // decrypt,
} = require('../../src/utils/sign');

const KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393';
const ADDRESS = '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b';

test('randomBuffer', () => {
  const buffer1 = randomBuffer(32);
  const buffer2 = randomBuffer(32);

  expect(buffer1.length).toEqual(32);
  expect(Hex(buffer1).length).toEqual(2 + 64);
  expect(buffer1.equals(buffer2)).toEqual(false); // almost impossible
});

test('randomPrivateKey', () => {
  const key1 = PrivateKey(randomPrivateKey());
  const key2 = PrivateKey(randomPrivateKey());
  expect(key1).not.toEqual(key2); // almost impossible

  const entropy = Hex.toBuffer('0x0123456789012345678901234567890123456789012345678901234567890123');
  const key3 = PrivateKey(randomPrivateKey(entropy));
  const key4 = PrivateKey(randomPrivateKey(entropy));
  expect(key3).not.toEqual(key4); // almost impossible

  const entropyInvalid = Hex.toBuffer('0x0123456789');
  expect(() => randomPrivateKey(entropyInvalid)).toThrow('entropy must be 32 length Buffer');
});

test('privateKeyToAddress', () => {
  const address = Address(privateKeyToAddress(Hex.toBuffer(KEY)));
  expect(address).toEqual(ADDRESS);
});

// test('encrypt and decrypt', () => {
//   const { salt, iv, cipher, mac } = encrypt(Hex.toBuffer(KEY), Buffer.from('password'));
//
//   expect(salt.length).toEqual(32);
//   expect(iv.length).toEqual(16);
//   expect(cipher.length).toEqual(32);
//   expect(mac.length).toEqual(32);
//
//   const key = Hex(decrypt({ salt, iv, cipher, mac }, Buffer.from('password')));
//   expect(key).toEqual(KEY);
// });

test('ecdsaSign and ecdsaRecover', () => {
  const hash = randomBuffer(32);
  const { r, s, v } = ecdsaSign(hash, Hex.toBuffer(KEY));

  expect(r.length).toEqual(32);
  expect(s.length).toEqual(32);
  expect(Number.isInteger(v)).toEqual(true);

  const publicKey = ecdsaRecover(hash, { r, s, v });
  const address = Hex(sha3(publicKey).slice(-20));
  expect(address).toEqual(ADDRESS);
});
