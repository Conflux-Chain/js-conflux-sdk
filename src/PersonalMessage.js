const PREFIX = '\x19Conflux Signed Message:\n';
const format = require('./util/format');
const Message = require('./Message');
const { keccak256 } = require('./util/sign');
const { isHexString } = require('./util');

class PersonalMessage extends Message {
  /**
   * Assemble the personal message
   * @param {string|Buffer} message - The origin message
   * @return {string}
   */
  static personalMessage(message) {
    const msgBuf = isHexString(message) ? format.hexBuffer(message) : Buffer.from(message);
    return PREFIX + msgBuf.length + msgBuf.toString();
  }

  /**
   * Assemble the personal message hash
   * @param {string|Buffer} message - The origin message
   * @return {string} The personal message hash
   */
  static personalHash(message) {
    const personalMsg = this.personalMessage(message);
    return format.hex(keccak256(Buffer.from(personalMsg)));
  }

  /**
   * Signs the hash with the privateKey.
   *
   * @param {string|Buffer} privateKey
   * @param {string|Buffer} message
   * @return {string} The signature as hex string.
   *
   * @example
   * > PersonalMessage.sign(
   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // privateKey
   'Hello world!',
   )
   "0xa2d98c5d47b35ba4ebdf03e2d9496312355dccc609bf38c93f19cc9f970e131d0e95504eb3c786714ab703f6924876704bc44bb71680802a87b4c4d2599ac96a00"
   */
  static sign(privateKey, message) {
    return super.sign(privateKey, this.personalHash(message));
  }

  /**
   * Recovers the signers publicKey from the signature.
   *
   * @param {string|Buffer} signature
   * @param {string|Buffer} message
   * @return {string} The publicKey as hex string.
   *
   * @example
   * > PersonalMessage.recover(
   '0xa2d98c5d47b35ba4ebdf03e2d9496312355dccc609bf38c93f19cc9f970e131d0e95504eb3c786714ab703f6924876704bc44bb71680802a87b4c4d2599ac96a00',
   'Hello world!',
   )
   "0x5e3eb3a2fbe124c62b382f078a1766c5b0b1306c38a496aa49e3702024a06cffe9da86ab15e4d017b6ef12794e9fe1751ce261a7b7c03be0c5b81ab9b040668a"
   */
  static recover(signature, message) {
    return super.recover(signature, this.personalHash(message));
  }

  /**
   * Recovers the wallet signers publicKey from the signature.
   *
   * @param {string} signature
   * @param {string} message
   * @return {string} The publicKey as hex string.
   *
   * @example
   > PersonalMessage.recoverPortalPersonalSign(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
   *
   > PersonalMessage.recoverPortalPersonalSign(
   '0x5f8499879ce281ff083f5716de68ab6d05b176edbb27b6c5882ab482dc00478e33679f15a30bc60510faab49c2bd0bf883ad0a45ad3160e424b35cddcc1ee85d1c',
   'Hello World',
   )
   "0x41f3b66efde8121599072d1c215c88682f491c4f9e3b2345667a3f9f4adb8449b3de23832f435f4d923872ed043449ee7843a0bfc3594c46c982ab5297009f78"
   */
  static recoverPortalPersonalSign(signature, message) {
    const v = parseInt(signature.slice(130), 16) - 27;
    signature = signature.slice(0, 130) + format.hex(v).slice(2);
    const messageHex = isHexString(message) ? message : format.hex(Buffer.from(message));
    const msg = new Message(PREFIX + messageHex.length + messageHex);
    return Message.recover(signature, msg.hash);
  }

  /**
   * Assemble the personal message hash
   * @param {string|Buffer} message - The origin message
   * @return {PersonalMessage}
   */
  constructor(message) {
    const personalMessage = PersonalMessage.personalMessage(message);
    super(personalMessage);
    this._originMsg = message;
    this._personalMsg = personalMessage;
    this._prefix = PREFIX;
  }
}

module.exports = PersonalMessage;
