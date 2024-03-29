const { assert } = require('../util');
const format = require('../util/format');
const Account = require('./Account');
const PrivateKeyAccount = require('./PrivateKeyAccount');

/**
 * Wallet to manager accounts.
 */
class Wallet extends Map {
  /**
   * @param {number} networkId
   * @return {Wallet}
   */
  constructor(networkId) {
    super();
    this.networkId = networkId;
  }

  /**
   * Set network id
   * @param {number} networkId
   */
  setNetworkId(networkId) {
    this.networkId = networkId;
  }

  /**
   * Check if address exist
   *
   * @param {string} address
   * @return {boolean}
   */
  has(address) {
    try {
      address = format.address(address, this.networkId);
      return super.has(address);
    } catch (e) {
      return false;
    }
  }

  /**
   * Drop one account by address
   *
   * @param {string} address
   * @return {boolean}
   */
  delete(address) {
    try {
      address = format.address(address, this.networkId);
      return super.delete(address);
    } catch (e) {
      return false;
    }
  }

  /**
   * Drop all account in wallet
   */
  clear() {
    return super.clear();
  }

  /**
   * @param {any} address - Key of account, usually is `address`
   * @param {any} account - Account instance
   * @return {any}
   */
  set(address, account) {
    address = format.address(address, this.networkId);

    assert(!this.has(address), `Wallet already has account "${address}"`);
    assert(account instanceof Account, `value not instance of Account, got ${account}`);
    return super.set(address, account);
  }

  /**
   * @param {string} address
   * @return {Account}
   */
  get(address) {
    address = format.address(address, this.networkId);

    const account = super.get(address);
    assert(account instanceof Account, `can not found Account by "${address}"`);
    return account;
  }

  /**
   * @param {string|Buffer} privateKey - Private key of account
   * @return {PrivateKeyAccount}
   */
  addPrivateKey(privateKey) {
    if (!this.networkId) {
      console.warn('wallet.addPrivateKey: networkId is not set properly, please set it');
    }
    const account = new PrivateKeyAccount(privateKey, this.networkId);
    this.set(account.address, account);
    return account;
  }

  /**
   * @param {string|Buffer} [entropy] - Entropy of random account
   * @return {PrivateKeyAccount}
   */
  addRandom(entropy) {
    const account = PrivateKeyAccount.random(entropy, this.networkId);
    this.set(account.address, account);
    return account;
  }

  /**
   * @param {object} keystore - Keystore version 3 object.
   * @param {string|Buffer} password - Password for keystore to decrypt with.
   * @return {PrivateKeyAccount}
   */
  addKeystore(keystore, password) {
    const account = PrivateKeyAccount.decrypt(keystore, password, this.networkId);
    this.set(account.address, account);
    return account;
  }
}

module.exports = Wallet;
