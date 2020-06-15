const lodash = require('lodash');
const format = require('./util/format');
const { randomPrivateKey, privateKeyToAddress, privateKeyToPublicKey, decrypt, encrypt } = require('./util/sign');
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
   * Create a account by privateKey.
   *
   * @param privateKey {string|Buffer}
   * @return {Account}
   */
  constructor(privateKey) {
    this.privateKey = format.privateKey(privateKey);
    this.publicKey = format.publicKey(privateKeyToPublicKey(format.buffer(privateKey)));
    this.address = format.address(privateKeyToAddress(format.buffer(privateKey)));
  }

  /**
   * Decrypt account encrypt info.
   *
   * @param password {string}
   * @param info {object}
   * @return {Account}
   */
  static decrypt(password, info) {
    const privateKeyBuffer = decrypt(Buffer.from(password), format.decrypt(info));
    return new this(privateKeyBuffer);
  }

  /**
   * Encrypt account privateKey to object.
   *
   * @param password {string}
   * @return {object}
   */
  encrypt(password) {
    const info = encrypt(format.buffer(this.privateKey), Buffer.from(password));
    info.id = `${Date.now()}-${lodash.random(100000, 999999)}`;
    info.address = this.address;
    return format.encrypt(info);
  }

  /**
   * Sign a transaction.
   *
   * @param options {object} - See 'Transaction'
   * @return {Transaction}
   */
  signTransaction(options) {
    const tx = new Transaction(options);
    tx.sign(this.privateKey); // sign will cover r,s,v fields
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
    msg.sign(this.privateKey); // sign will cover r,s,v fields
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
