const format = require('./util/format');
const { privateKeyToAddress, randomPrivateKey } = require('./util/sign'); // and decrypt, encrypt
const Transaction = require('./Transaction');

class Account {
  /**
   * Create a account by privateKey.
   *
   * @param privateKey {string|Buffer}
   * @return {Account}
   */
  constructor(privateKey) {
    this.privateKey = format.privateKey(privateKey);
    this.address = format.address(privateKeyToAddress(format.buffer(this.privateKey)));
  }

  /**
   * Create a new Account with random privateKey.
   *
   * @param entropy
   * @return {Account}
   *
   * @example
   * > Account.random()
   Account {
      privateKey: '0x1a402b7c1a7417dc7236c152df5861a24d60a7beca7890bae10ccfb85e9ed037',
      address: '0xf0bf7c4ebb8b0acde3529aafd05b0bac7edb6ddc'
    }
   * > Account.random() // gen a different account from above
   Account {
      privateKey: '0x08c9201ea1de182f67a794f4a2ef3dfeb8f0bdf9488a78006c79048d08553299',
      address: '0xa5ec380e0378df6399b887ad1d45b60c8f3631f6'
    }

   * > Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   Account {
      privateKey: '0x6238653ddcd62238d7b47dd70a6059d9978b771cd99388fd6423f6a3a54be535',
      address: '0x20e3118c92c8f16e2307308c67db06cdd3978e13'
    }
   * > Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   * // gen a different account from above, even use same entropy
   Account {
      privateKey: '0x4d6a462c78e7603ae4707672a4716799e9ebce4e267de42a0402665eee4a4e62',
      address: '0x881302cd9a3d85ccb7048ff5e679c23b5e80c0eb'
    }
   */
  static random(entropy) {
    const privateKeyBuffer = randomPrivateKey(entropy !== undefined ? format.buffer(entropy) : undefined);
    return new this(privateKeyBuffer);
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
   * @return {string} Account address as string.
   */
  toString() {
    return this.address;
  }
}

module.exports = Account;
