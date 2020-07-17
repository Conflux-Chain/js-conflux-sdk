const { assert, uuidV4 } = require('./util');
const format = require('./util/format');
const { randomPrivateKey, privateKeyToPublicKey, publicKeyToAddress, decrypt, encrypt } = require('./util/sign');
const Transaction = require('./Transaction');
const Message = require('./Message');

class Account {
  /**
   * Create a new Account with random privateKey.
   *
   * @param entropy
   * @return {Account}
   *
   * @example
   * > Account.random()
   Account {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: '0x1cecb4a2922b7007e236daf0c797de6e55496e84'
    }
   * > Account.random() // gen a different account from above
   Account {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: '0x16c25691aadc3363f5862d264072584f3ebf4613'
    }
   * > Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   Account {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: '0x113d49784c80d6f8fdbc0bef5a5ab0d9c9fee520'
    }
   * > Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   * // gen a different account from above, even use same entropy
   Account {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: '0x1f63fcef4aaa88c03cbb5c9fb34be69dee65d0a8'
    }
   */
  static random(entropy) {
    const privateKeyBuffer = randomPrivateKey(entropy !== undefined ? format.buffer(entropy) : undefined);
    return new this(privateKeyBuffer);
  }

  /**
   * Create a account.
   *
   * @param string {string|Buffer} - Account privateKey or publicKey or address
   * @return {Account}
   */
  constructor(string) {
    const hex = format.hex(string);

    switch (hex.length) {
      case 2 + 40: // address
        this.address = format.address(hex);
        break;

      case 2 + 64: // privateKey
        this.privateKey = format.privateKey(hex);
        this.publicKey = format.publicKey(privateKeyToPublicKey(format.buffer(this.privateKey)));
        this.address = format.address(publicKeyToAddress(format.buffer(this.publicKey)));
        break;

      case 2 + 128: // publicKey
        this.publicKey = format.publicKey(hex);
        this.address = format.address(publicKeyToAddress(format.buffer(this.publicKey)));
        break;

      default:
        throw new Error(`unexpected hex length when create Account with "${hex}"`);
    }
  }

  /**
   * Decrypt account encrypt info.
   *
   * @param keystoreV3 {object}
   * @param password {string}
   * @return {Account}
   */
  static decrypt({
    version,
    crypto: {
      ciphertext,
      cipherparams: { iv },
      cipher: algorithm,
      kdf,
      kdfparams: { dklen: dkLen, salt, n: N, r, p },
      mac,
    },
  }, password) {
    assert(version === 3, 'Not a valid V3 wallet');
    assert(kdf === 'scrypt', `Unsupported kdf "${kdf}", only support "scrypt"`);

    const privateKeyBuffer = decrypt({
      algorithm, N, r, p, dkLen,
      salt: Buffer.from(salt, 'hex'),
      iv: Buffer.from(iv, 'hex'),
      cipher: Buffer.from(ciphertext, 'hex'),
      mac: Buffer.from(mac, 'hex'),
    }, Buffer.from(password));

    return new this(privateKeyBuffer);
  }

  /**
   * Encrypt account privateKey to object.
   *
   * @param password {string}
   * @return {object} - keystoreV3 object
   *
   * @example
   * > account = new Account('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   * > account.encrypt('password')
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
  encrypt(password) {
    const key = format.buffer(format.privateKey(this.privateKey));
    const { algorithm, N, r, p, dkLen, salt, iv, cipher, mac } = encrypt(key, Buffer.from(password));

    return {
      version: 3,
      id: uuidV4(),
      address: this.address.replace(/^0x/, ''),
      crypto: {
        ciphertext: cipher.toString('hex'),
        cipherparams: { iv: iv.toString('hex') },
        cipher: algorithm,
        kdf: 'scrypt',
        kdfparams: { dklen: dkLen, salt: salt.toString('hex'), n: N, r, p },
        mac: mac.toString('hex'),
      },
    };
  }

  /**
   * Sign a transaction.
   *
   * @param options {object} - See [Transaction](Transaction.js/constructor)
   * @return {Transaction}
   */
  signTransaction(options) {
    const tx = new Transaction(options);
    tx.sign(format.privateKey(this.privateKey)); // sign will cover r,s,v fields
    if (tx.from !== this.address) {
      throw new Error(`Invalid signature, transaction.from !== ${this.address}`);
    }
    return tx;
  }

  /**
   * Sign a string.
   *
   * @param message {string}
   * @return {Message}
   *
   * @example
   * > const account = new Account('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   * > const msg = account.signMessage('Hello World!')
   * > console.log(msg);
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
   */
  signMessage(message) {
    const msg = new Message(message);
    msg.sign(format.privateKey(this.privateKey)); // sign will cover r,s,v fields
    if (msg.from !== this.address) {
      throw new Error(`Invalid signature, message.from !== ${this.address}`);
    }
    return msg;
  }

  /**
   * @return {string} Account address as string.
   */
  toString() {
    return this.address;
  }
}

module.exports = Account;
