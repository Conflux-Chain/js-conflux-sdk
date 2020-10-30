const { assert } = require('../util');
const format = require('../util/format');
const Account = require('./Account');
const PrivateKeyAccount = require('./PrivateKeyAccount');

/**
 * Wallet to manager accounts.
 */
class Wallet extends Map {
  /**
   * Check if address exist
   *
   * @param address {string}
   * @return {boolean}
   */
  has(address) {
    try {
      address = format.address(address);
      return super.has(address);
    } catch (e) {
      return false;
    }
  }

  /**
   * Drop one account by address
   *
   * @param address {string}
   * @return {boolean}
   */
  delete(address) {
    try {
      address = format.address(address);
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
   * @param address {string} - Key of account, usually is `address`
   * @param account {Account} - Account instance
   * @return {Wallet}
   */
  set(address, account) {
    address = format.address(address);

    assert(!this.has(address), `Wallet already has account "${address}"`);
    assert(account instanceof Account, `value not instance of Account, got ${account}`);
    return super.set(address, account);
  }

  /**
   * @param address {string}
   * @return {Account}
   */
  get(address) {
    address = format.address(address);

    const account = super.get(address);
    assert(account instanceof Account, `can not found Account by "${address}"`);
    return account;
  }

  /**
   * @param privateKey {string|Buffer} - Private key of account
   * @return {PrivateKeyAccount}
   */
  addPrivateKey(privateKey) {
    const account = new PrivateKeyAccount(privateKey);
    this.set(account.address, account);
    return account;
  }

  /**
   * @param [entropy] {string|Buffer} - Entropy of random account
   * @return {PrivateKeyAccount}
   */
  addRandom(entropy) {
    const account = PrivateKeyAccount.random(entropy);
    this.set(account.address, account);
    return account;
  }

  /**
   * @param keystore {object} - Keystore version 3 object.
   * @param password {string|Buffer} - Password for keystore to decrypt with.
   * @return {PrivateKeyAccount}
   */
  addKeystore(keystore, password) {
    const account = PrivateKeyAccount.decrypt(keystore, password);
    this.set(account.address, account);
    return account;
  }
}

module.exports = Wallet;
