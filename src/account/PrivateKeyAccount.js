const { format, sign, assert } = require('../util');
const BaseAccount = require('./BaseAccount');
const Transaction = require('../Transaction');
const Message = require('../Message');

class PrivateKeyAccount extends BaseAccount {
  /**
   * Create a new PrivateKeyAccount with random privateKey.
   *
   * @param [entropy] {string|Buffer}
   * @param [conflux] {Conflux}
   * @return {PrivateKeyAccount}
   *
   * @example
   * > PrivateKeyAccount.random()
   PrivateKeyAccount {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: '0x1cecb4a2922b7007e236daf0c797de6e55496e84'
    }
   * > PrivateKeyAccount.random() // gen a different account from above
   PrivateKeyAccount {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: '0x16c25691aadc3363f5862d264072584f3ebf4613'
    }
   * > PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   PrivateKeyAccount {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: '0x113d49784c80d6f8fdbc0bef5a5ab0d9c9fee520'
    }
   * > PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   * // gen a different account from above, even use same entropy
   PrivateKeyAccount {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: '0x1f63fcef4aaa88c03cbb5c9fb34be69dee65d0a8'
    }
   */
  static random(entropy, conflux) {
    const privateKeyBuffer = sign.randomPrivateKey(entropy !== undefined ? format.buffer(entropy) : undefined);
    return new PrivateKeyAccount(privateKeyBuffer, conflux);
  }

  /**
   * Decrypt account encrypt info.
   *
   * @param keystore {object}
   * @param password {string|Buffer}
   * @param [conflux] {Conflux}
   * @return {PrivateKeyAccount}
   */
  static decrypt(keystore, password, conflux) {
    const privateKeyBuffer = sign.decrypt(keystore, password);
    return new PrivateKeyAccount(privateKeyBuffer, conflux);
  }

  /**
   * Create a account by privateKey.
   *
   * @param privateKey {string|Buffer}
   * @param conflux {Conflux}
   * @return {PrivateKeyAccount}
   */
  constructor(privateKey, conflux) {
    const privateKeyBuffer = format.buffer(privateKey);
    const publicKeyBuffer = sign.privateKeyToPublicKey(privateKeyBuffer);
    const addressBuffer = sign.publicKeyToAddress(publicKeyBuffer);

    super(addressBuffer, conflux);
    this.publicKey = format.publicKey(publicKeyBuffer);
    this.privateKey = format.privateKey(privateKeyBuffer);
  }

  /**
   * Encrypt account privateKey to object.
   *
   * @param password {string}
   * @return {object} - keystoreV3 object
   *
   * @example
   * > account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   * > account.encrypt('password')
   {version:3, id:..., address:..., crypto:...}
   */
  encrypt(password) {
    return sign.encrypt(format.buffer(this.privateKey), password);
  }

  /**
   * Sign a transaction.
   *
   * @param options {object} - See [Transaction](Transaction.js/constructor)
   * @return {Promise<Transaction>}
   */
  async signTransaction(options) {
    const transaction = new Transaction(options);
    transaction.sign(this.privateKey); // sign will cover r,s,v fields

    assert(transaction.from === this.address, {
      message: 'Invalid sign transaction.from',
      expected: this.address,
      got: transaction.from,
    });

    return transaction;
  }

  /**
   * Sign a string.
   *
   * @param message {string}
   * @return {Promise<Message>}
   *
   * @example
   * > const account = new PrivateKeyAccount(undefined, '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   * > const msg = account.signMessage('Hello World!')
   * > console.log(msg);
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
   */
  async signMessage(message) {
    const msg = new Message(message);
    msg.sign(this.privateKey); // sign will cover r,s,v fields

    assert(msg.from === this.address, {
      message: 'Invalid sign message.from',
      expected: this.address,
      got: msg.from,
    });

    return msg;
  }
}

module.exports = PrivateKeyAccount;
