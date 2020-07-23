const format = require('../util/format');
const { decorate } = require('../util');
const { PendingTransaction } = require('../subscribe');

class BaseAccount {
  /**
   * @param address {string}
   * @param conflux {Conflux}
   */
  constructor(address, conflux) {
    this.address = format.address(address);
    this.conflux = conflux;

    this.sendTransaction = decorate(this.sendTransaction, (func, ...args) => {
      return new PendingTransaction(func, args, this.conflux);
    });
  }

  /**
   * @param options {Object}
   * @return {Promise<Transaction>}
   */
  async signTransaction(options) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name}.signTransaction not implemented`);
  }

  /**
   * @param options {Object}
   * @return {Promise<Message>}
   */
  async signMessage(options) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name}.signMessage not implemented`);
  }

  /**
   * @return {string} Address as string.
   */
  toString() {
    return this.address;
  }

  // --------------------------------------------------------------------------
  /**
   *
   * @param options {object}
   * @return {Promise<PendingTransaction>}
   *
   * @example
   * > txHash = await account.sendTransaction({to:address, value:1});
   "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"

   * @example
   * > packedTx = await account.sendTransaction({to:address, value:1}).get(); // await till transaction packed
   {
    "nonce": "8",
    "value": "0",
    "gasPrice": "1000000000",
    "gas": "21000",
    "v": 0,
    "transactionIndex": null,
    "status": null,
    "storageLimit": "0",
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": null,
    "contractCreated": null,
    "data": "0x",
    "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b"
   }

   * @example
   * > minedTx = await account.sendTransaction({to:address, value:1}).mined(); // await till transaction mined
   {
    "nonce": "8",
    "value": "0",
    "gasPrice": "1000000000",
    "gas": "21000",
    "v": 0,
    "transactionIndex": 0,
    "status": 0,
    "storageLimit": "0",
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "data": "0x",
    "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b"
   }

   * @example
   * > executedReceipt = await account.sendTransaction({to:address, value:1}).executed(); // await till transaction executed
   {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": "21000",
    "gasFee": "21000000000000",
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
   }

   * @example
   * > confirmedReceipt = await account.sendTransaction({to:address, value:1}).confirmed(); // await till risk coefficient < threshold (default 1e-8)
   {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": "21000",
    "gasFee": "21000000000000",
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
   }
   */
  async sendTransaction({ ...options }) {
    options.from = this.address; // must set from to address for `estimateGasAndCollateral`
    if (options.nonce === undefined) {
      options.nonce = await this.conflux.getNextNonce(this.address);
    }

    if (options.chainId === undefined) {
      const status = await this.conflux.getStatus();
      options.chainId = status.chainId;
    }

    if (options.epochHeight === undefined) {
      options.epochHeight = await this.conflux.getEpochNumber();
    }

    if (options.gasPrice === undefined) {
      if (this.conflux.defaultGasPrice === undefined) {
        options.gasPrice = await this.conflux.getGasPrice() || 1; // MIN_GAS_PRICE
      } else {
        options.gasPrice = this.conflux.defaultGasPrice;
      }
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      const { gasUsed, storageCollateralized } = await this.conflux.estimateGasAndCollateral(options);

      if (options.gas === undefined) {
        options.gas = gasUsed;
      }

      if (options.storageLimit === undefined) {
        options.storageLimit = storageCollateralized;
      }
    }

    const transaction = await this.signTransaction(options);
    return this.conflux.sendRawTransaction(transaction.serialize());
  }
}

module.exports = BaseAccount;
