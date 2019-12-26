const rlp = require('./utils/rlp');
const { Hex, Address, PrivateKey, Drip } = require('./utils/type');
const { sha3, ecdsaSign, ecdsaRecover, publicKeyToAddress } = require('./utils/sign');

function throwError(...args) {
  throw new Error(...args);
}

class Transaction {
  /**
   * @param options {object}
   * @param options.from {string} - The address the transaction is send from.
   * @param options.nonce {string|number} - This allows to overwrite your own pending transactions that use the same nonce.
   * @param options.gasPrice {string|number} - The gasPrice used for each paid gas.
   * @param options.gas {string|number} - The gas provided for the transaction execution. It will return unused gas.
   * @param [options.to] {string} - The address the transaction is directed to.
   * @param [options.value] {string|number|BigNumber} - the value sent with this transaction
   * @param [options.data=''] {string|Buffer} - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
   * @return {object} Formatted send transaction options object.
   */
  static sendOptions({ from, nonce, gasPrice, gas, to, value, data }) {
    return {
      from: from !== undefined ? Address(from) : throwError(`'from' is required and should match 'Address', got ${from}`),
      nonce: nonce !== undefined ? Hex.fromNumber(nonce) : throwError(`'nonce' is required and should match 'uint', got ${nonce}`),
      gasPrice: gasPrice !== undefined ? Drip(gasPrice) : throwError(`'gasPrice' is required and should match 'Drip', got ${gasPrice}`),
      gas: gas !== undefined ? Hex.fromNumber(gas) : throwError(`'gas' is required and should match 'uint', got ${gas}`),
      to: to !== undefined ? Address(to) : undefined,
      value: value !== undefined ? Drip(value) : undefined,
      data: data !== undefined ? Hex(data) : Hex(''),
    };
  }

  /**
   * @param options {object}
   * @param [options.from] {string} - The address the transaction is sent from.
   * @param [options.nonce] {string|number} - The caller nonce (transaction count).
   * @param [options.gasPrice] {string|number} - The gasPrice used for each paid gas.
   * @param [options.gas] {string|number} - The gas provided for the transaction execution. `call` consumes zero gas, but this parameter may be needed by some executions.
   * @param options.to {string} - The address the transaction is directed to.
   * @param [options.value] {string|number|BigNumber} - Integer of the value sent with this transaction.
   * @param [options.data] {string|Buffer} - Hash of the method signature and encoded parameters.
   * @return {object} Formatted call contract options object.
   */
  static callOptions({ from, nonce, gasPrice, gas, to, value, data }) {
    return {
      from: from !== undefined ? Address(from) : undefined,
      nonce: nonce !== undefined ? Hex.fromNumber(nonce) : undefined,
      gasPrice: gasPrice !== undefined ? Drip(gasPrice) : undefined,
      gas: gas !== undefined ? Hex.fromNumber(gas) : undefined,
      to: to !== undefined ? Address(to) : throwError(`'to' is required and should match 'Address', got ${to}`),
      value: value !== undefined ? Drip(value) : undefined,
      data: data !== undefined ? Hex(data) : undefined,
    };
  }

  /**
   * @param options {object}
   * @param [options.from] {string} - The address the transaction is sent from.
   * @param [options.nonce] {string|number} - The caller nonce (transaction count).
   * @param [options.gasPrice] {string|number} - The gasPrice used for each paid gas.
   * @param [options.gas] {string|number} - The gas provided for the transaction execution. `call` consumes zero gas, but this parameter may be needed by some executions.
   * @param [options.to] {string} - The address the transaction is directed to.
   * @param [options.value] {string|number|BigNumber} - Integer of the value sent with this transaction.
   * @param [options.data] {string|Buffer} - Hash of the method signature and encoded parameters.
   * @return {object} Formatted call contract options object.
   */
  static estimateOptions({ from, nonce, gasPrice, gas, to, value, data }) {
    return {
      from: from !== undefined ? Address(from) : undefined,
      nonce: nonce !== undefined ? Hex.fromNumber(nonce) : undefined,
      gasPrice: gasPrice !== undefined ? Drip(gasPrice) : undefined,
      gas: gas !== undefined ? Hex.fromNumber(gas) : undefined,
      to: to !== undefined ? Address(to) : undefined,
      value: value !== undefined ? Drip(value) : undefined,
      data: data !== undefined ? Hex(data) : undefined,
    };
  }

  /**
   * @param options {object}
   * @param options.nonce {string|number} - This allows to overwrite your own pending transactions that use the same nonce.
   * @param options.gasPrice {string|number|BigNumber} - The price of gas for this transaction in drip.
   * @param options.gas {string|number} - The amount of gas to use for the transaction (unused gas is refunded).
   * @param [options.to=null] {string} - The destination address of the message, left undefined for a contract-creation transaction.
   * @param [options.value=0] {string|number|BigNumber} - The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
   * @param [options.data=''] {string|Buffer} - Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
   * @param [options.r=null] {string|Buffer} - ECDSA signature r
   * @param [options.s=null] {string|Buffer} - ECDSA signature s
   * @param [options.v=null] {string|number} - ECDSA recovery id
   * @return {object} Formatted sign transaction options object.
   */
  static rawOptions({ nonce, gasPrice, gas, to, value, data, r, s, v }) {
    return {
      nonce: nonce !== undefined ? Hex.fromNumber(nonce) : throwError(`'nonce' is required and should match 'uint', got ${nonce}`),
      gasPrice: gasPrice !== undefined ? Drip(gasPrice) : throwError(`'gasPrice' is required and should match 'Drip', got ${gasPrice}`),
      gas: gas !== undefined ? Hex.fromNumber(gas) : throwError(`'gas' is required and should match 'uint', got ${gas}`),
      to: to !== undefined ? Address(to) : Hex(null),
      value: value !== undefined ? Drip(value) : Drip(0),
      data: data !== undefined ? Hex(data) : Hex(''),
      r: r !== undefined ? Hex(r) : undefined,
      s: s !== undefined ? Hex(s) : undefined,
      v: v !== undefined ? Hex(v) : undefined,
    };
  }

  /**
   * Signs a transaction. This account needs to be unlocked.
   *
   * @param options {object} - See `Transaction.rawOptions`
   * @return {Transaction}
   */
  constructor(options) {
    Object.assign(this, Transaction.rawOptions(options));
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
      return Hex(sha3(this.encode(true)));
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
      const publicKey = ecdsaRecover(sha3(this.encode(false)), {
        r: Hex.toBuffer(this.r),
        s: Hex.toBuffer(this.s),
        v: Number(this.v),
      });
      return Hex(publicKeyToAddress(publicKey));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Sign transaction and set 'r','s','v'.
   *
   * @param privateKey {string} - Private key hex string.
   */
  sign(privateKey) {
    const { r, s, v } = ecdsaSign(sha3(this.encode(false)), Hex.toBuffer(PrivateKey(privateKey)));
    this.r = Hex(r);
    this.s = Hex(s);
    this.v = Hex(v);
  }

  /**
   * Encode rlp.
   *
   * @param [includeSignature=false] {boolean} - Whether or not to include the signature.
   * @return {Buffer}
   */
  encode(includeSignature = false) {
    const raw = [this.nonce, this.gasPrice, this.gas, this.to, this.value, this.data]; // ordered
    if (includeSignature) {
      if (this.v === undefined) {
        throwError('`v` is required and should match `Hex`');
      }
      if (this.r === undefined) {
        throwError('`r` is required and should match `Hex`');
      }
      if (this.s === undefined) {
        throwError('`s` is required and should match `Hex`');
      }
      raw.push(this.v, this.r, this.s); // ordered
    }
    return rlp.encode(raw.map(Hex.toBuffer));
  }

  /**
   * Get the raw tx hex string.
   *
   * @return {Buffer}
   */
  serialize() {
    return Hex(this.encode(true));
  }
}

module.exports = Transaction;
