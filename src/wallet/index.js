const { assert } = require('../util');
const Account = require('./Account');
const PrivateKeyAccount = require('./PrivateKeyAccount');

class Wallet extends Map {
  /**
   * @param key {string} - Key of account, usually is `address`
   * @param account {Account} - Account instance
   * @return {Wallet}
   */
  set(key, account) {
    assert(!this.has(key), `Wallet already has account "${key}"`);
    assert(account instanceof Account, `value not instance of Account, got ${account}`);
    return super.set(key, account);
  }

  /**
   * @param key {string}
   * @return {Account}
   */
  get(key) {
    const account = super.get(key);
    assert(account instanceof Account, `can not found Account by "${key}"`);
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
