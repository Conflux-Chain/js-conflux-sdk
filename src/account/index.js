const PrivateKeyAccount = require('./PrivateKeyAccount');

/**
 * @param options {object}
 * @param [options.privateKey] {string|Buffer} - Private key of account
 * @param [options.keystore] {object} - Keystore version 3 to decode private key
 * @param [options.password] {string|Buffer} - Password of keystore
 * @param [options.random] {boolean} - `true` to gen account private key by random Buffer, else throw Error.
 * @param [options.entropy] {string|Buffer} - Entropy of random account
 * @param [conflux] {Conflux} - Conflux instance to connected with
 * @return {BaseAccount} A BaseAccount subclass instance
 *
 * @example
 * > accountFactory({ privateKey:'0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' })
 PrivateKeyAccount {
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  }

 * @example
 * > accountFactory({ random: true })
 PrivateKeyAccount {
    address: '0x15963e53096ddc12d4cd75fa56fae2851af018a1',
    publicKey: '0x9bbf094935f3f6d107496844b71b97435378d1cddeb7213c380a664513c95af50d9cc9e906cde8ea12795cdd74297b62f845bc7e77e8366d8a29fba9d18987c2',
    privateKey: '0xf0456ad16e8689601b0012fe855c293f4e557c62738ff36a66f5ece3d1b851d8'
  }

 * > accountFactory({ random: true, entropy: randomBuffer(32) })
 PrivateKeyAccount {
    address: '0x1f2b907176958b2a5a09f40dafee7119bc2e06a8',
    publicKey: '0x0f5e8fd193256f78b512feebfce8b7baca9eea642d7e9df2b68452bf58105a96440c31ef535c6ee4e5d6033b79151c2152fce646b10da51a0392affd29b64eeb',
    privateKey: '0x432bed0c45596b1d734af06ff876c46ab48317e8f10bf68b8d3dd0894d8cce0b'
  }

 * @example
 * > accountFactory({ keystore, password });
 PrivateKeyAccount {
    address: '0x15abcfe17ae631aa93051988e5a49f737ca319cf',
    publicKey: '0x21301d39fdfbb7222c168660ac845e0edf6c40de012d0b452f6703190484f557ffe996531e5ea242b98a5adc5556d25589ec98b1c0ff5694ede8bf52a301d14d',
    privateKey: '0x7bb5398ce0ef4f8f8ab9f80c6a700973554882e5b2b1e10e0efe02fb5c5383bc'
  }
 */
function accountFactory(options, conflux) {
  if (options.privateKey !== undefined) {
    return new PrivateKeyAccount(options.privateKey, conflux);
  }

  if (options.keystore !== undefined && options.password !== undefined) {
    return PrivateKeyAccount.decrypt(options.keystore, options.password, conflux);
  }

  if (options.random === true) {
    return PrivateKeyAccount.random(options.entropy, conflux);
  }

  throw new Error('Invalid account options');
}

module.exports = accountFactory;
