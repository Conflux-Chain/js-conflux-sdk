const { keccak256, ecdsaSign, ecdsaRecover, privateKeyToAddress, publicKeyToAddress } = require('./util/sign');
const rlp = require('./util/rlp');
const format = require('./util/format');
const cfxFormat = require('./rpc/types/formatter');

/**
 * @typedef {import('./rpc/types/formatter').CallRequest} TransactionMeta
 */

class Transaction {
  /**
   * Decode rlp encoded raw transaction hex string
   *
   * @param {string} raw - rlp encoded transaction hex string
   * @returns {Transaction} A Transaction instance
   */
  static decodeRaw(raw) {
    const [
      [nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data],
      v,
      r,
      s,
    ] = rlp.decode(raw);

    const netId = format.uInt(chainId);
    const tx = new Transaction({
      nonce: format.bigIntFromBuffer(nonce),
      gasPrice: format.bigIntFromBuffer(gasPrice),
      gas: format.bigIntFromBuffer(gas),
      to: to.length === 0 ? null : format.address(to, netId),
      value: format.bigIntFromBuffer(value),
      storageLimit: format.bigIntFromBuffer(storageLimit),
      epochHeight: format.bigIntFromBuffer(epochHeight),
      chainId: format.uInt(chainId),
      data: format.hex(data),
      v: v.length === 0 ? 0 : format.uInt(v),
      r: format.hex(r),
      s: format.hex(s),
    });

    const publicKey = tx.recover();
    const hexAddress = publicKeyToAddress(format.hexBuffer(publicKey));
    tx.from = format.address(hexAddress, netId);
    return tx;
  }

  /**
   * Create a transaction.
   *
   * @param {object} options
   * @param {string} [options.from] - The sender address.
   * @param {string|number} [options.nonce] - This allows to overwrite your own pending transactions that use the same nonce.
   * @param {string|number} [options.gasPrice] - The price of gas for this transaction in drip.
   * @param {string|number} [options.gas]- The amount of gas to use for the transaction (unused gas is refunded).
   * @param {string} [options.to] - The destination address of the message, left undefined for a contract-creation transaction.
   * @param {string|number} [options.value] - The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
   * @param {string|number} [options.storageLimit] - The storage limit specified by the sender.
   * @param {string|number} [options.epochHeight] - The epoch proposed by the sender. Note that this is NOT the epoch of the block containing this transaction.
   * @param {string|number} [options.chainId] - The chain ID specified by the sender.
   * @param {string|Buffer} [options.data]- Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
   * @param {string|Buffer} [options.r] - ECDSA signature r
   * @param {string|Buffer} [options.s] - ECDSA signature s
   * @param {number} [options.v] - ECDSA recovery id
   * @return {Transaction}
   */
  constructor({ from, nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, v, r, s }) {
    this.from = from;
    this.nonce = nonce;
    this.gasPrice = gasPrice;
    this.gas = gas;
    this.to = to;
    this.value = value;
    this.storageLimit = storageLimit;
    this.epochHeight = epochHeight;
    this.chainId = chainId;
    this.data = data;
    this.v = v;
    this.r = r;
    this.s = s;
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
      return format.hex(keccak256(this.encode(true)));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Sign transaction and set 'r','s','v'.
   *
   * @param {string} privateKey - Private key hex string.
   * @param {number} networkId - fullnode's network id.
   * @return {Transaction}
   */
  sign(privateKey, networkId) {
    const privateKeyBuffer = format.hexBuffer(privateKey);
    const addressBuffer = privateKeyToAddress(privateKeyBuffer);
    const { r, s, v } = ecdsaSign(keccak256(this.encode(false)), privateKeyBuffer);

    this.from = format.address(addressBuffer, networkId);
    this.r = format.hex(r);
    this.s = format.hex(s);
    this.v = v;

    return this;
  }

  /**
   * Recover public key from signed Transaction.
   *
   * @return {string}
   */
  recover() {
    const publicKey = ecdsaRecover(keccak256(this.encode(false)), {
      r: format.hexBuffer(this.r),
      s: format.hexBuffer(this.s),
      v: format.uInt(this.v),
    });
    return format.publicKey(publicKey);
  }

  /**
   * Encode rlp.
   *
   * @param {boolean} [includeSignature=false] - Whether or not to include the signature.
   * @return {Buffer}
   */
  encode(includeSignature) {
    const { nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, v, r, s } = cfxFormat.signTx(this);

    const raw = includeSignature
      ? [[nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data], v, r, s]
      : [nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data];

    return rlp.encode(raw);
  }

  /**
   * Get the raw transaction hex string.
   *
   * @return {string} Hex string
   */
  serialize() {
    return format.hex(this.encode(true));
  }
}

module.exports = Transaction;
