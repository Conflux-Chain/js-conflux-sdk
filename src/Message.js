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
      hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
      r: undefined,
      s: undefined,
      v: undefined
    }
   * > msg.sign('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
   Message {
      message: 'Hello World',
      hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
      r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
      s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
      v: 1
    }
   * > msg.signature
   "0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101"
   * > msg.from
   "0xfcad0b19bb29d4674531d6f115237e16afce377c"
   */
  constructor({ message, hash, signature, r, s, v }) {
    if (message !== undefined) {
      if (hash !== undefined) {
        throw new Error('OverrideError, can not set `message` with `hash`');
      }

      const messageBuffer = Buffer.from(message);
      const prefix = Buffer.from(`\x19Ethereum Signed Message:\n${messageBuffer.length}`);
      hash = format.hex(sha3(Buffer.concat([prefix, messageBuffer])));
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
      const publicKey = ecdsaRecover(format.buffer(this.hash), {
        r: format.buffer(this.r),
        s: format.buffer(this.s),
        v: format.uint(this.v),
      });
      return format.hex(publicKeyToAddress(publicKey));
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
   */
  sign(privateKey) {
    const { r, s, v } = ecdsaSign(format.buffer(this.hash), format.buffer(privateKey));

    // FIXME: hex for usable, but should Transaction.sign hex too ?
    Object.assign(this, { r: format.hex(r), s: format.hex(s), v });
  }
}

module.exports = Message;
