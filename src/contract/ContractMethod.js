import { assert } from '../util';
import { FunctionCoder, errorCoder } from '../abi';
import callable from '../lib/callable';

/**
 * @memberOf Contract
 */
class Called {
  constructor(cfx, coder, { to, data }) {
    this.cfx = cfx;
    this.coder = coder;
    this.to = to;
    this.data = data;
  }

  /**
   * Will send a transaction to the smart contract and execute its method.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: This can alter the smart contract state.
   *
   * @param options {object} - See `format.sendTx`
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   */
  sendTransaction(options) {
    return this.cfx.sendTransaction({
      to: this.to,
      data: this.data,
      ...options,
    });
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * @param options {object} - See `format.estimateTx`
   * @return {Promise<object>} The gas used and storage occupied for the simulated call/transaction.
   */
  estimateGasAndCollateral(options) {
    return this.cfx.estimateGasAndCollateral({
      to: this.to,
      data: this.data,
      ...options,
    });
  }

  /**
   * Executes a message call transaction,
   * set contract.address as `to`,
   * set contract method encode as `data`.
   *
   * > Note: Can not alter the smart contract state.
   *
   * @param options {object} - See `format.callTx`.
   * @param epochNumber {string|number} - See `Conflux.call`.
   * @return {Promise<*>} Decoded contact call return.
   */
  async call(options, epochNumber) {
    const hex = await this.cfx.call(
      {
        to: this.to,
        data: this.data,
        ...options,
      },
      epochNumber,
    );

    try {
      const array = this.coder.decodeOutputs(hex);
      return array.length <= 1 ? array[0] : array;
    } catch (e) {
      throw errorCoder.decodeError(hex) || e;
    }
  }

  async then(resolve, reject) {
    try {
      const result = await this.call();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }
}

export default class ContractMethod {
  static get Called() {
    return Called;
  }

  constructor(cfx, contract, name) {
    this.cfx = cfx;
    this.contract = contract;
    this.name = name;
    this.signatureToCoder = {};

    return callable(this, this.call.bind(this));
  }

  add(fragment) {
    const coder = new FunctionCoder(fragment);
    this.signatureToCoder[coder.signature()] = coder;
  }

  call(...args) {
    const types = [];

    for (const [signature, coder] of Object.entries(this.signatureToCoder)) {
      try {
        const to = this.contract.address;
        const data = `${signature}${coder.encodeInputs(args).substring(2)}`;

        return new Called(this.cfx, coder, { to, data });
      } catch (e) {
        types.push(coder.type);
      }
    }

    throw new Error(`can not match "${types.join(',')}" with args (${args.join(',')})`);
  }

  decodeData(hex) {
    const signature = hex.slice(0, 10); // '0x' + 8 hex
    const data = hex.slice(10);
    const coder = this.signatureToCoder[signature];

    assert(coder, {
      message: 'ContractMethod.decodeData signature missing',
      expect: signature,
      got: coder,
      coder: this,
    });

    return coder.decodeInputs(data);
  }
}
