import format from './util/format';
import { randomPrivateKey, privateKeyToAddress, privateKeyToPublicKey } from './util/sign'; // and decrypt, encrypt
import Transaction from './Transaction';
import Message from './Message';

export default class Account {
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
      address: '0xbcecb4a2922b7007e236daf0c797de6e55496e84'
    }
   * > Account.random() // gen a different account from above
   Account {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: '0xb6c25691aadc3363f5862d264072584f3ebf4613'
    }
   * > Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   Account {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: '0x613d49784c80d6f8fdbc0bef5a5ab0d9c9fee520'
    }
   * > Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   * // gen a different account from above, even use same entropy
   Account {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: '0x8f63fcef4aaa88c03cbb5c9fb34be69dee65d0a8'
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

  // /**
  //  * Decrypt account encrypt info.
  //  *
  //  * @param info {object}
  //  * @param password {string}
  //  * @return {Account}
  //  */
  // static decrypt(info, password) {
  //   const privateKeyBuffer = decrypt(lodash.mapValues(info, format.buffer), Buffer.from(password));
  //   return new this(privateKeyBuffer);
  // }
  //
  // /**
  //  * Encrypt account privateKey to object.
  //  *
  //  * @param password {string}
  //  * @return {object}
  //  */
  // encrypt(password) {
  //   const info = encrypt(format.buffer(this.privateKey), Buffer.from(password));
  //   return lodash.mapValues(info, format.hex);
  // }

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
      hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
      r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
      s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
      v: 1
    }

   * @example
   * > const msg = new Message({
      hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
      r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
      s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
      v: 1
    });
   * > console.log(msg.form); // getter to recover address
   "0xfcad0b19bb29d4674531d6f115237e16afce377c"
   */
  signMessage(message) {
    const msg = new Message({ message });
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
