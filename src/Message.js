const { sha3, ecdsaSign, ecdsaRecover, publicKeyToAddress } = require('./util/sign');
const format = require('./util/format');

class Message {
  /**
   * @param messageOrOptions {string|object} - The string or message object
   * @param [messageOrOptions.hash] {string|Buffer} - The hashed message
   * @param [messageOrOptions.r] {string|Buffer} - ECDSA signature r
   * @param [messageOrOptions.s] {string|Buffer} - ECDSA signature s
   * @param [messageOrOptions.v] {number} - ECDSA recovery id
   * @return {Message}
   */
  constructor(messageOrOptions) {
    if (typeof messageOrOptions === 'string') {
      this.message = messageOrOptions;
    } else {
      const { hash, r, s, v } = messageOrOptions;
      Object.assign(this, { hash, r, s, v });
    }
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
   * Sign message and set 'r','s','v' and 'hash'.
   *
   * @param privateKey {string} - Private key hex string.
   */
  sign(privateKey) {
    const buffer = Buffer.from(this.message);
    const prefix = Buffer.from(`\x19Ethereum Signed Message:\n${buffer.length}`);
    const hash = sha3(Buffer.concat([prefix, buffer]));
    const { r, s, v } = ecdsaSign(hash, format.buffer(privateKey));

    // FIXME: hex for usable, but should Transaction.sign hex too ?
    Object.assign(this, {
      hash: format.hex(hash),
      r: format.hex(r),
      s: format.hex(s),
      v,
    });
  }
}

module.exports = Message;
