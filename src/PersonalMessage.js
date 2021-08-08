const PREFIX = '\x19Conflux Signed Message:\n';
const format = require('./util/format');
const Message = require('./Message');
const { keccak256 } = require('./util/sign');
const { isHexString } = require('./util');

class PersonalMessage extends Message {
  static personalMessage(message) {
    const msgBuf = isHexString(message) ? format.hexBuffer(message) : Buffer.from(message);
    return PREFIX + msgBuf.length + msgBuf.toString();
  }

  static personalHash(message) {
    const personalMsg = this.personalMessage(message);
    return format.hex(keccak256(Buffer.from(personalMsg)));
  }

  /**
   * Signs the hash with the privateKey.
   *
   * @param privateKey {string|Buffer}
   * @param message {string|Buffer}
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
   * @param signature {string|Buffer}
   * @param message {string|Buffer}
   * @return {string} The publicKey as hex string.
   *
   * @example
   * > PersonalMessage.recover(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
   */
  static recover(signature, message) {
    return super.recover(signature, this.personalHash(message));
  }

  /**
   * Recovers the portal signers publicKey from the signature.
   *
   * @param signature {string}
   * @param message {string}
   * @return {string} The publicKey as hex string.
   *
   * @example
   * > PersonalMessage.recoverPortalPersonalSign(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
   */
  static recoverPortalPersonalSign(signature, message) {
    const v = parseInt(signature.slice(130), 16) - 27;
    signature = signature.slice(0, 130) + format.hex(v).slice(2);
    const messageHex = isHexString(message) ? message : format.hex(Buffer.from(message));
    const msg = new Message(PREFIX + messageHex.length + messageHex);
    return Message.recover(signature, msg.hash);
  }

  constructor(message) {
    const msgBuf = isHexString(message) ? format.hexBuffer(message) : Buffer.from(message);
    const personalMessage = PREFIX + msgBuf.length + msgBuf.toString();
    super(personalMessage);
    this._originMsg = message;
    this._personalMsg = personalMessage;
    this._prefix = PREFIX;
  }
}

module.exports = PersonalMessage;
