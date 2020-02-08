const { sha3, ecdsaSign, ecdsaRecover, publicKeyToAddress } = require('./util/sign');
const format = require('./util/format');

class Message {
  /**
   * @param options {string|object} - The string or message object
   * @param [options.message] {string|Buffer} - The hashed message, will cover 'hash' fields
   * @param [options.hash] {string|Buffer} - The hashed message
   * @param [options.signature] {string|Buffer} - ECDSA signature, will cover 'r','s','v' fields
   * @param [options.r] {string|Buffer} - ECDSA signature r
   * @param [options.s] {string|Buffer} - ECDSA signature s
   * @param [options.v] {number} - ECDSA recovery id
   * @return {Message}
   *
   * @example
   * > msg = new Message({ message: 'Hello World' });
   Message {
      message: 'Hello World',
      hash: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
      r: undefined,
      s: undefined,
      v: undefined
    }
   * > msg.sign('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
   Message {
      message: 'Hello World',
      hash: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
      r: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c',
      s: '0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f',
      v: 1,
    }
   * > msg.signature
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01"
   * > msg.from
   "0xfcad0b19bb29d4674531d6f115237e16afce377c"
   */
  constructor({ message, hash, signature, r, s, v }) {
    if (message !== undefined) {
      if (hash !== undefined) {
        throw new Error('OverrideError, can not set `message` with `hash`');
      }

      hash = format.hex(sha3(Buffer.from(message)));
    }

    if (signature !== undefined) {
      if (r !== undefined || s !== undefined || v !== undefined) {
        throw new Error('OverrideError, can not set `signature` with `r` or `s` or `v`');
      }

      const signatureBuffer = format.buffer(signature);
      r = format.hex64(signatureBuffer.slice(0, 32));
      s = format.hex64(signatureBuffer.slice(32, 64));
      v = format.uint(signatureBuffer[64]);
    }

    Object.assign(this, { message, hash, r, s, v });
  }

  /**
   * Getter of sender address.
   *
   * > Note: calculate every time.
   *
   * @return {string|undefined} If ECDSA recover success return address, else return undefined.
   */
  get from() {
    try {
      return format.hex(publicKeyToAddress(format.buffer(this.recover())));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Getter signature of message r,s,v.
   *
   * @return {string}
   */
  get signature() {
    try {
      return format.signature(Buffer.concat([
        format.buffer(this.r),
        format.buffer(this.s),
        format.buffer(this.v),
      ]));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Sign message and set 'r','s','v' and 'hash'.
   *
   * @param privateKey {string} - Private key hex string.
   * @return {Message}
   */
  sign(privateKey) {
    const { r, s, v } = ecdsaSign(format.buffer(this.hash), format.buffer(privateKey));
    Object.assign(this, { r: format.hex(r), s: format.hex(s), v });
    return this;
  }

  /**
   * Recover public key from signed Transaction.
   *
   * @return {string}
   */
  recover() {
    const publicKey = ecdsaRecover(format.buffer(this.hash), {
      r: format.buffer(this.r),
      s: format.buffer(this.s),
      v: format.uint(this.v),
    });
    return format.publicKey(publicKey);
  }
}

module.exports = Message;
