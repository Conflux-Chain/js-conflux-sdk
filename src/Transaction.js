const { sha3, ecdsaSign, ecdsaRecover, publicKeyToAddress, rlpEncode } = require('./util/sign');
const format = require('./util/format');

class Transaction {
  /**
   * Create a transaction.
   *
   * @param options {object}
   * @param options.nonce {string|number} - This allows to overwrite your own pending transactions that use the same nonce.
   * @param options.gasPrice {string|number} - The price of gas for this transaction in drip.
   * @param options.gas {string|number} - The amount of gas to use for the transaction (unused gas is refunded).
   * @param [options.to=null] {string} - The destination address of the message, left undefined for a contract-creation transaction.
   * @param [options.value=0] {string|number} - The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
   * @param [options.data='0x'] {string|Buffer} - Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
   * @param [options.r] {string|Buffer} - ECDSA signature r
   * @param [options.s] {string|Buffer} - ECDSA signature s
   * @param [options.v] {number} - ECDSA recovery id
   * @return {Transaction}
   */
  constructor({ nonce, gasPrice, gas, to, value, data, v, r, s }) {
    Object.assign(this, { nonce, gasPrice, gas, to, value, data, v, r, s });
  }

  /**
   * Getter of transaction hash include signature.
   *
   * > Note: calculate every time.
   *
   * @return {string|undefined} If transaction has r,s,v return hex string, else return undefined.
   */
  get hash() {
    try {
      return format.hex(sha3(this.encode(true)));
    } catch (e) {
      return undefined;
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
      return format.hex(publicKeyToAddress(format.buffer(this.recover())));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Sign transaction and set 'r','s','v'.
   *
   * @param privateKey {string} - Private key hex string.
   * @return {Transaction}
   */
  sign(privateKey) {
    const { r, s, v } = ecdsaSign(sha3(this.encode(false)), format.buffer(privateKey));
    Object.assign(this, { r: format.hex(r), s: format.hex(s), v });
    return this;
  }

  /**
   * Recover public key from signed Transaction.
   *
   * @return {string}
   */
  recover() {
    const publicKey = ecdsaRecover(sha3(this.encode(false)), {
      r: format.buffer(this.r),
      s: format.buffer(this.s),
      v: format.uint(this.v),
    });
    return format.publicKey(publicKey);
  }

  /**
   * Encode rlp.
   *
   * @param [includeSignature=false] {boolean} - Whether or not to include the signature.
   * @return {Buffer}
   */
  encode(includeSignature) {
    const { nonce, gasPrice, gas, to, value, data, v, r, s } = format.signTx(this);

    const raw = includeSignature
      ? [nonce, gasPrice, gas, to, value, data, v, r, s]
      : [nonce, gasPrice, gas, to, value, data];

    return rlpEncode(raw.map(format.buffer));
  }

  /**
   * Get the raw tx hex string.
   *
   * @return {string} Hex string
   */
  serialize() {
    return format.hex(this.encode(true));
  }
}

module.exports = Transaction;
