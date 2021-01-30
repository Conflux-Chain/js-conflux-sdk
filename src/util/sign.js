const crypto = require('crypto');
const keccak = require('keccak');
const secp256k1 = require('secp256k1');
const { syncScrypt: scrypt } = require('scrypt-js');

// ----------------------------------------------------------------------------
/**
 * keccak 256
 *
 * @param buffer {Buffer}
 * @return {Buffer}
 *
 * @example
 * > keccak256(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
 */
function keccak256(buffer) {
  return keccak('keccak256').update(buffer).digest();
}

/**
 * Makes a checksum address
 *
 * > Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
 * > Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet
 *
 * @deprecated Please use address.ethChecksumAddress
 * @param address {string} - Hex string
 * @return {string}
 *
 * @example
 * > checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
 */
function checksumAddress(address) {
  const string = address.toLowerCase().replace('0x', '');

  const hash = keccak256(Buffer.from(string)).toString('hex');
  const sequence = Object.entries(string).map(([index, char]) => {
    return parseInt(hash[index], 16) >= 8 ? char.toUpperCase() : char;
  });
  return `0x${sequence.join('')}`;
}

// ----------------------------------------------------------------------------
/**
 * gen a random buffer with `size` bytes.
 *
 * > Note: call `crypto.randomBytes`
 *
 * @param size {number}
 * @return {Buffer}
 *
 * @example
 * > randomBuffer(0)
 <Buffer >
 * > randomBuffer(1)
 <Buffer 33>
 * > randomBuffer(1)
 <Buffer 5a>
 */
function randomBuffer(size) {
  return crypto.randomBytes(size);
}

/**
 * Gen a random PrivateKey buffer.
 *
 * @param entropy {Buffer}
 * @return {Buffer}
 *
 * @example
 * > randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
 * > randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>

 * @example
 * > entropy = randomBuffer(32)
 * > randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
 * > randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
 */
function randomPrivateKey(entropy = randomBuffer(32)) {
  if (!(Buffer.isBuffer(entropy) && entropy.length === 32)) {
    throw new Error(`entropy must be 32 length Buffer, got "${typeof entropy}"`);
  }

  const inner = keccak256(Buffer.concat([randomBuffer(32), entropy]));
  const middle = Buffer.concat([randomBuffer(32), inner, randomBuffer(32)]);
  return keccak256(middle);
}

/**
 * @param privateKey {Buffer}
 * @return {Buffer}
 */
function privateKeyToPublicKey(privateKey) {
  return secp256k1.publicKeyCreate(privateKey, false).slice(1);
}

/**
 * Get account address by public key.
 *
 * > Account address hex starts with '0x1'
 *
 * @param publicKey {Buffer}
 * @return {Buffer}
 *
 * @example
 * > publicKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
 */
function publicKeyToAddress(publicKey) {
  const buffer = keccak256(publicKey).slice(-20);
  buffer[0] = (buffer[0] & 0x0f) | 0x10; // eslint-disable-line no-bitwise
  return buffer;
}

/**
 * Get address by private key.
 *
 * @param privateKey {Buffer}
 * @return {Buffer}
 *
 * @example
 * > privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
 */
function privateKeyToAddress(privateKey) {
  return publicKeyToAddress(privateKeyToPublicKey(privateKey));
}

/**
 * Sign ecdsa
 *
 * @param hash {Buffer}
 * @param privateKey {Buffer}
 * @return {object} ECDSA signature object.
 * - r {Buffer}
 * - s {Buffer}
 * - v {number}
 *
 * @example
 * > privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
 * > buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
 * > ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
 */
function ecdsaSign(hash, privateKey) {
  const sig = secp256k1.sign(hash, privateKey);
  return {
    r: sig.signature.slice(0, 32),
    s: sig.signature.slice(32, 64),
    v: sig.recovery,
  };
}

/**
 * Recover ecdsa
 *
 * @param hash {Buffer}
 * @param options {object}
 * @param options.r {Buffer}
 * @param options.s {Buffer}
 * @param options.v {number}
 * @return {Buffer} publicKey
 *
 * @example
 * > privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
 * > buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
 * > privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
 * > publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
 */
function ecdsaRecover(hash, { r, s, v }) {
  const senderPublic = secp256k1.recover(hash, Buffer.concat([r, s]), v);
  return secp256k1.publicKeyConvert(senderPublic, false).slice(1);
}

// ----------------------------------------------------------------------------
function uuidV4() {
  return [4, 2, 2, 2, 6].map(randomBuffer).map(v => v.toString('hex')).join('-');
}

/**
 *
 * @param privateKey {Buffer}
 * @param password {string|Buffer}
 * @return {object} - keystoreV3 object
 *
 * @example
 * > encrypt(Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'), 'password')
 {
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }
 */
function encrypt(privateKey, password) {
  const cipher = 'aes-128-ctr';
  const n = 8192;
  const r = 8;
  const p = 1;
  const dklen = 32;
  const salt = randomBuffer(32);
  const iv = randomBuffer(16);

  password = Buffer.from(password);
  const derived = scrypt(password, salt, n, r, p, dklen);
  const ciphertext = crypto.createCipheriv(cipher, derived.slice(0, 16), iv).update(privateKey);
  const mac = keccak256(Buffer.concat([derived.slice(16, 32), ciphertext]));
  const address = privateKeyToAddress(privateKey);

  return {
    version: 3,
    id: uuidV4(),
    address: address.toString('hex'),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: { iv: iv.toString('hex') },
      cipher,
      kdf: 'scrypt',
      kdfparams: { dklen, salt: salt.toString('hex'), n, r, p },
      mac: mac.toString('hex'),
    },
  };
}

/**
 * Decrypt account encrypt info.
 *
 * @param keystoreV3 {object}
 * @param password {string|Buffer}
 * @return {Buffer} Buffer of private key
 *
 * @example
 * > decrypt({
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }, 'password')
 <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef>
 */
function decrypt({
  version,
  crypto: {
    ciphertext,
    cipherparams: { iv },
    cipher,
    kdf,
    kdfparams: { dklen, salt, n, r, p },
    mac,
  },
}, password) {
  if (version !== 3) {
    throw new Error('Not a valid V3 wallet');
  }
  if (kdf !== 'scrypt') {
    throw new Error(`Unsupported kdf "${kdf}", only support "scrypt"`);
  }

  password = Buffer.from(password);
  ciphertext = Buffer.from(ciphertext, 'hex');
  iv = Buffer.from(iv, 'hex');
  salt = Buffer.from(salt, 'hex');
  mac = Buffer.from(mac, 'hex');

  const derived = scrypt(password, salt, n, r, p, dklen);
  if (!keccak256(Buffer.concat([derived.slice(16, 32), ciphertext])).equals(mac)) {
    throw new Error('Key derivation failed, possibly wrong password!');
  }
  return crypto.createDecipheriv(cipher, derived.slice(0, 16), iv).update(ciphertext);
}

module.exports = {
  keccak256,
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
};
