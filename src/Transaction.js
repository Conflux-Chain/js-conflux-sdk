const { keccak256, ecdsaSign, ecdsaRecover, privateKeyToAddress, publicKeyToAddress } = require('./util/sign');
const rlp = require('./util/rlp');
const format = require('./util/format');
const cfxFormat = require('./rpc/types/formatter');
const { AccessList } = require('./primitives/AccessList');
const {
  TXRLP_TYPE_PREFIX_2930,
  TXRLP_TYPE_PREFIX_1559,
  TRANSACTION_TYPE_LEGACY,
  TRANSACTION_TYPE_EIP2930,
  TRANSACTION_TYPE_EIP1559,
} = require('./CONST');

/**
 * @typedef {import('./rpc/types/formatter').CallRequest} TransactionMeta
 */

class Transaction {
  /**
   * Decode rlp encoded raw transaction hex string
   * @param {string} raw - rlp encoded transaction hex string
   * @returns {Transaction} A Transaction instance
   */
  static decodeRaw(raw) {
    const buf = format.hexBuffer(raw);
    const prefix = buf.slice(0, 4);
    let tx = null;

    if (prefix.equals(TXRLP_TYPE_PREFIX_2930)) {
      tx = Transaction.decode2930(buf.slice(4));
    } else if (prefix.equals(TXRLP_TYPE_PREFIX_1559)) {
      tx = Transaction.decode1559(buf.slice(4));
    } else {
      tx = Transaction.decodeLegacy(raw);
    }

    const publicKey = tx.recover();
    const hexAddress = publicKeyToAddress(format.hexBuffer(publicKey));
    tx.from = format.address(hexAddress, tx.chainId);

    return tx;
  }

  static formatTxMeta({ nonce, gas, to, value, storageLimit, epochHeight, chainId, data, r, s, v }) {
    const chainIdNum = format.uInt(chainId);
    return {
      nonce: format.bigIntFromBuffer(nonce),
      gas: format.bigIntFromBuffer(gas),
      to: to.length === 0 ? null : format.address(to, chainIdNum),
      value: format.bigIntFromBuffer(value),
      storageLimit: format.bigIntFromBuffer(storageLimit),
      epochHeight: format.bigIntFromBuffer(epochHeight),
      chainId: chainIdNum,
      data: format.hex(data),
      v: v.length === 0 ? 0 : format.uInt(v),
      r: format.hex(r),
      s: format.hex(s),
    };
  }

  static decodeLegacy(raw) {
    const [
      [nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data],
      v,
      r,
      s,
    ] = rlp.decode(raw);

    const formatedMeta = Transaction.formatTxMeta({ nonce, gas, to, value, storageLimit, epochHeight, chainId, data, r, s, v });
    const tx = new Transaction({
      type: TRANSACTION_TYPE_LEGACY,
      gasPrice: format.bigIntFromBuffer(gasPrice),
      ...formatedMeta,
    });

    return tx;
  }

  static decode2930(raw) {
    const [
      [nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, accessList],
      v,
      r,
      s,
    ] = rlp.decode(raw);

    const formatedMeta = Transaction.formatTxMeta({ nonce, gas, to, value, storageLimit, epochHeight, chainId, data, r, s, v });
    const tx = new Transaction({
      type: TRANSACTION_TYPE_EIP2930,
      gasPrice: format.bigIntFromBuffer(gasPrice),
      accessList,
      ...formatedMeta,
    });

    return tx;
  }

  static decode1559(raw) {
    const [
      [nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, storageLimit, epochHeight, chainId, data, accessList],
      v,
      r,
      s,
    ] = rlp.decode(raw);

    const formatedMeta = Transaction.formatTxMeta({ nonce, gas, to, value, storageLimit, epochHeight, chainId, data, r, s, v });

    const tx = new Transaction({
      type: TRANSACTION_TYPE_EIP1559,
      maxPriorityFeePerGas: format.bigIntFromBuffer(maxPriorityFeePerGas),
      maxFeePerGas: format.bigIntFromBuffer(maxFeePerGas),
      accessList,
      ...formatedMeta,
    });

    return tx;
  }

  /**
   * Create a transaction.
   *
   * @param {object} options
   * @param {number} [options.type] - Tx type: 0 for legacy, 1 for EIP-2930, 2 for EIP-1559
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
   * @param {number} [options.v] - ECDSA signature v
   * @param {array} [options.accessList] - EIP-2930 access list
   * @param {string|number} [options.maxPriorityFeePerGas] - EIP-1559 maxPriorityFeePerGas
   * @param {string|number} [options.maxFeePerGas] - EIP-1559 maxFeePerGas
   * @return {Transaction}
   */
  constructor({
    type,
    from,
    nonce,
    gasPrice,
    gas,
    to,
    value,
    storageLimit,
    epochHeight,
    chainId,
    data,
    v,
    r,
    s,
    accessList,
    maxPriorityFeePerGas,
    maxFeePerGas,
  }) {
    this.type = type;
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
    this.accessList = accessList ? new AccessList(accessList) : undefined;
    this.maxPriorityFeePerGas = maxPriorityFeePerGas;
    this.maxFeePerGas = maxFeePerGas;
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
    const { r, s, v } = ecdsaSign(keccak256(this.encode(false)), privateKeyBuffer);
    this.r = format.hex(r);
    this.s = format.hex(s);
    this.v = v;

    const addressBuffer = privateKeyToAddress(privateKeyBuffer);
    this.from = format.address(addressBuffer, networkId || this.chainId);

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
   * Infer the transaction type from the fields.
   * @returns {number} Transaction type
   */
  txType() {
    if (this.type !== undefined) {
      return this.type;
    } else if (this.maxPriorityFeePerGas !== undefined && this.maxFeePerGas !== undefined) {
      return TRANSACTION_TYPE_EIP1559;
    } else if (this.accessList !== undefined) {
      return TRANSACTION_TYPE_EIP2930;
    } else {
      return TRANSACTION_TYPE_LEGACY;
    }
  }

  typePrefix() {
    let prefix = Buffer.from([]);
    if (this.txType() === TRANSACTION_TYPE_EIP2930) {
      prefix = TXRLP_TYPE_PREFIX_2930;
    } else if (this.txType() === TRANSACTION_TYPE_EIP1559) {
      prefix = TXRLP_TYPE_PREFIX_1559;
    }
    return prefix;
  }

  encodeAccessList() {
    return this.accessList ? this.accessList.encode() : [];
  }

  /**
   * Encode rlp.
   *
   * @param {boolean} [includeSignature=false] - Whether or not to include the signature.
   * @return {Buffer}
   */
  encode(includeSignature) {
    let raw;
    if (this.txType() === TRANSACTION_TYPE_LEGACY) { // legacy transaction
      const { nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, v, r, s } = cfxFormat.signTx(this);

      raw = includeSignature
        ? [[nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data], v, r, s]
        : [nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data];
    } else if (this.txType() === TRANSACTION_TYPE_EIP2930) { // 2930 transaction
      const { nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, v, r, s } = cfxFormat.signTx(this);
      const accessList = this.encodeAccessList();

      raw = includeSignature
        ? [[nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, accessList], v, r, s]
        : [nonce, gasPrice, gas, to, value, storageLimit, epochHeight, chainId, data, accessList];
    } else if (this.txType() === TRANSACTION_TYPE_EIP1559) { // 1559 transaction
      const { nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, storageLimit, epochHeight, chainId, data, v, r, s } = cfxFormat.sign1559Tx(this);
      const accessList = this.encodeAccessList();

      raw = includeSignature
        ? [[nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, storageLimit, epochHeight, chainId, data, accessList], v, r, s]
        : [nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, storageLimit, epochHeight, chainId, data, accessList];
    } else {
      throw new Error('Unsupported transaction type');
    }
    return Buffer.concat([this.typePrefix(), rlp.encode(raw)]);
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
