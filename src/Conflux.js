const lodash = require('lodash');
const { decorate } = require('./util');
const format = require('./util/format');

const providerFactory = require('./provider');
const Contract = require('./contract');
const Wallet = require('./wallet');
const { PendingTransaction, LogIterator } = require('./subscribe');

/**
 * A sdk of conflux.
 */
class Conflux {
  /**
   * @param [options] {object} - Conflux and Provider constructor options.
   * @param [options.url=''] {string} - Url of provider to create.
   * @param [options.defaultEpoch="latest_state"] {string|number} - Default epochNumber. (deprecated)
   * @param [options.defaultGasPrice] {string|number|BigNumber} - The default gas price in drip to use for transactions. (deprecated)
   * @param [options.defaultGas] {string|number|BigNumber} - The default maximum gas provided for a transaction. (deprecated)
   *
   * @example
   * > const Conflux = require('conflux-web');
   * > const cfx = new Conflux({url:'http://testnet-jsonrpc.conflux-chain.org:12537'});
   *
   * @example
   * > const cfx = new Conflux({
   *   url: 'http://localhost:8000',
   *   defaultGasPrice: 100,
   *   defaultGas: 100000,
   *   logger: console,
   * });
   */
  constructor({
    url = '',
    defaultEpoch = 'latest_state',
    defaultGasPrice,
    defaultGas,
    ...rest
  } = {}) {
    this.provider = this.setProvider(url, rest);
    this.wallet = new Wallet(this);

    /**
     * Default epoch number for following methods:
     * - `Conflux.getBalance`
     * - `Conflux.getTransactionCount`
     * - `Conflux.getCode`
     * - `Conflux.call`
     *
     * @deprecated
     * @type {number|string}
     */
    this.defaultEpoch = defaultEpoch;

    /**
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     * - `Conflux.call`
     * - `Conflux.estimateGas`
     *
     * @deprecated
     * @type {number|BigNumber|string}
     */
    this.defaultGasPrice = defaultGasPrice;

    /**
     * Default gas limit for following methods:
     * - `Conflux.sendTransaction`
     * - `Conflux.call`
     * - `Conflux.estimateGas`
     *
     * @deprecated
     * @type {number|BigNumber|string}
     */
    this.defaultGas = defaultGas;

    decorate(this, 'sendTransaction', (func, params) => {
      return new PendingTransaction(this, func, params);
    });

    decorate(this, 'sendRawTransaction', (func, params) => {
      return new PendingTransaction(this, func, params);
    });

    decorate(this, 'getLogs', (func, params) => {
      return new LogIterator(this, func, params);
    });
  }

  /**
   * Create and set `provider`.
   *
   * @param url {string} - Url of provider to create.
   * @param [options] {object} - Provider constructor options.
   * @return {Object}
   *
   * @example
   * > cfx.provider;
   HttpProvider {
     url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
     timeout: 60000,
     ...
   }

   * > cfx.setProvider('http://localhost:8000');
   * > cfx.provider;
   HttpProvider {
     url: 'http://localhost:8000',
     timeout: 60000,
     ...
   }
   */
  setProvider(url, options = {}) {
    if (!this.provider) {
      this.provider = providerFactory(url, options);
    } else if (url !== this.provider.url) {
      const provider = providerFactory(url, { ...this.provider, ...options });
      this.provider.close(); // close after factory create success
      this.provider = provider;
    } else {
      Object.assign(this.provider, options);
    }

    return this.provider;
  }

  /**
   * A shout cut for `new Contract(cfx, options);`
   *
   * @param options {object} - See `Contract.constructor`
   * @return {Contract}
   */
  Contract(options) {
    return new Contract(this, options);
  }

  /**
   * close connection.
   *
   * @example
   * > cfx.close();
   */
  close() {
    if (this.provider) {
      this.provider.close();
    }
  }

  // --------------------------------------------------------------------------
  /**
   * Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.
   *
   * @return {Promise<BigNumber>} Gas price in drip.
   *
   * @example
   * > await cfx.getGasPrice();
   "0"
   */
  async getGasPrice() {
    const result = await this.provider.call('cfx_gasPrice');
    return format.bigNumber(result);
  }

  /**
   * Returns the current epochNumber the client is on.
   *
   * @param [epochNumber] {string|number} - The end epochNumber to count balance of.
   * @return {Promise<number>} EpochNumber
   *
   * @example
   * > await cfx.getEpochNumber();
   200109
   */
  async getEpochNumber(epochNumber = 'latest_mined') {
    const result = await this.provider.call('cfx_epochNumber', format.epochNumber(epochNumber));
    return format.number(result);
  }

  /**
   * Gets past logs, matching the given options.
   *
   * @param [options] {object}
   * @param [options.fromEpoch] {string|number} - The number of the start block. (>=)
   * @param [options.toEpoch] {string|number} - The number of the stop block.(<=)
   * @param [options.blockHashes] {string[]} - The block hash list
   * @param [options.address] {string|string[]} - An address or a list of addresses to only get logs from particular account(s).
   * @param [options.topics] {array} - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x12...']. You can also pass an array for each topic with options for that topic e.g. [null, ['option1', 'option2']]
   * @param [options.limit] {number} - Limit log number.
   * @return {Promise<LogIterator>} Array of log objects.
   * - `string` address: Address this event originated from.
   * - `string[]` topics: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the event.
   * - `string` data: The data containing non-indexed log parameter.
   * - `string` type: TODO
   * - `boolean` removed: TODO
   * - `number` epochNumber: The epochNumber this log was created in. null when still pending.
   * - `string` blockHash: Hash of the block this event was created in. null when it’s still pending.
   * - `string` transactionHash: Hash of the transaction this event was created in.
   * - `string` transactionIndex: Integer of the transaction’s index position the event was created in.
   * - `number` logIndex: Integer of the event index position in the block.
   * - `number` transactionLogIndex: Integer of the event index position in the transaction.
   *
   * @example
   * > await cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 0,
      toEpoch: 'latest_mined',
      limit: 1,
      topics: [
        '0xb818399ffd68e821c34de8d5fbc5aeda8456fdb9296fc1b02bf6245ade7ebbd4',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ]
    });

   [
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      blockHash: '0x701afee0ffc49aaebadf0e6618b6ec1715d31e7aa639e2e00dc8df10994e0283',
      data: '0x',
      epochNumber: 542556,
      logIndex: 0,
      removed: false,
      topics: [
        '0xb818399ffd68e821c34de8d5fbc5aeda8456fdb9296fc1b02bf6245ade7ebbd4',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ],
      transactionHash: '0x5a301d2c342709d7de9da24bd096ab3754ea328b016d85ab3410d375616f5d0d',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined'
     },
   ]

   * @example
   * > logIter = cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 'latest_mined',
      limit: 2,
      })
   * > await logIter.next({threshold: 0.01, delta: 1000});
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
   * > await logIter.next();
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
   * > await logIter.next();
   undefined

   * @example
   * > logIter = cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 'latest_mined',
      limit: 2,
      })
   * > for await (const log of iter) {
       console.log(log);
     }
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
   ...
   */
  async getLogs(options) {
    if (options.blockHashes !== undefined && (options.fromEpoch !== undefined || options.toEpoch !== undefined)) {
      throw new Error('Override waring, do not use `blockHashes` with `fromEpoch` or `toEpoch`, cause only `blockHashes` will take effect');
    }

    const result = await this.provider.call('cfx_getLogs', format.getLogs(options));

    return format.logs(result);
  }

  // ------------------------------- address ----------------------------------
  /**
   * Get the balance of an address at a given epochNumber.
   *
   * @param address {string} - The address to get the balance of.
   * @param [epochNumber=this.defaultEpoch] {string|number} - The end epochNumber to count balance of.
   * @return {Promise<BigNumber>} Address balance number in drip.
   *
   * @example
   * > let balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   * > balance;
   BigNumber { s: 1, e: 18, c: [ 17936, 36034970586632 ] }

   * > Drip.toCFX(balance).toString(10);
   1.793636034970586632

   * > balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
   * > balance.toString(10);
   0
   */
  async getBalance(address, epochNumber = this.defaultEpoch) {
    const result = await this.provider.call('cfx_getBalance', format.address(address), format.epochNumber(epochNumber));
    return format.bigNumber(result);
  }

  /**
   * Get the numbers of transactions sent from this address.
   *
   * @param address {string} - The address to get the numbers of transactions from.
   * @param [epochNumber=this.defaultEpoch] {string|number} - The end epochNumber to count transaction of.
   * @return {Promise<number>}
   *
   * @example
   * > await cfx.getTransactionCount("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   61

   * > await cfx.getTransactionCount("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
   0
   */
  async getTransactionCount(address, epochNumber = this.defaultEpoch) {
    const result = await this.provider.call('cfx_getTransactionCount', format.address(address), format.epochNumber(epochNumber));
    return format.number(result);
  }

  // -------------------------------- epoch -----------------------------------

  // eslint-disable-next-line no-unused-vars
  async getRiskCoefficient(epochNumber) {
    // FIXME rpc not implement yet.
    // const result = await this.provider.call('cfx_getRiskCoefficient', format.epochNumber(epochNumber));
    return 0;
  }

  /**
   * Get the epochNumber pivot block info.
   *
   * @param epochNumber {string|number} - EpochNumber or string in ["latest_state", "latest_mined"]
   * @param [detail=false] {boolean} - `true` return transaction object, `false` return TxHash array
   * @return {Promise<object|null>} The block info (same as `getBlockByHash`).
   *
   * @example
   * > await cfx.getBlockByEpochNumber(449);
   {
     hash: '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40',
     ...
   }
   */
  async getBlockByEpochNumber(epochNumber, detail = false) {
    if (!lodash.isBoolean(detail)) {
      throw new Error('detail must be boolean');
    }
    const result = await this.provider.call('cfx_getBlockByEpochNumber', format.epochNumber(epochNumber), detail);
    return format.block.or(null)(result);
  }

  /**
   * Get block hash array of a epochNumber.
   *
   * @param epochNumber {string|number} - EpochNumber or string in ["latest_state", "latest_mined"]
   * @return {Promise<string[]>} Block hash array, last one is the pivot block hash of this epochNumber.
   *
   * @example
   * > await cfx.getBlocksByEpochNumber(0);
   ['0x2da120ad267319c181b12136f9e36be9fba59e0d818f6cc789f04ee937b4f593']

   * > await cfx.getBlocksByEpochNumber(449);
   [
   '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   ]
   */
  async getBlocksByEpochNumber(epochNumber) {
    return this.provider.call('cfx_getBlocksByEpoch', format.epochNumber(epochNumber));
  }

  // -------------------------------- block -----------------------------------
  /**
   * > TODO
   *
   * @return {Promise<string>}
   *
   * @example
   * > await cfx.getBestBlockHash();
   "0x43ddda130fff8539b9f3c431aa1b48e021b3744aacd224cbd4bcdb64373f3dd5"
   */
  async getBestBlockHash() {
    return this.provider.call('cfx_getBestBlockHash');
  }

  /**
   * Returns a block matching the block hash.
   *
   * @param blockHash {string} - The hash of block to be get.
   * @param [detail=false] {boolean} - `true` return transaction object, `false` return TxHash array
   * @return {Promise<object|null>} Block info object.
   * - `string` miner: The address of the beneficiary to whom the mining rewards were given.
   * - `string|null` hash: Hash of the block. `null` when its pending block.
   * - `string` parentHash: Hash of the parent block.
   * - `string[]` refereeHashes: Array of referee hashes.
   * - `number|null` epochNumber: The current block epochNumber in the client's view. `null` when it's not in best block's past set.
   * - `boolean|null` stable: If the block stable or not. `null` for pending stable.
   * - `string` nonce: Hash of the generated proof-of-work. `null` when its pending block.
   * - `number` gas: The maximum gas allowed in this block.
   * - `string` difficulty: Integer string of the difficulty for this block.
   * - `number` height: The block heights. `null` when its pending block.
   * - `number` size: Integer the size of this block in bytes.
   * - `number` blame: 0 if there's nothing to blame; k if the block is blaming on the state info of its k-th ancestor.
   * - `boolean` adaptive: If the block's weight adaptive or not.
   * - `number` timestamp: The unix timestamp for when the block was collated.
   * - `string` transactionsRoot: The hash of the transactions of the block.
   * - `string[]` transactions: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
   * - `string` deferredLogsBloomHash: The hash of the deferred block's log bloom filter
   * - `string` deferredReceiptsRoot: The hash of the receipts of the block after deferred execution.
   * - `string` deferredStateRoot: The root of the final state trie of the block after deferred execution.
   * - `object` deferredStateRootWithAux: Information of deferred state root
   *
   * @example
   * > await cfx.getBlockByHash('0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40');
   {
    "miner": "0x0000000000000000000000000000000000000015",
    "hash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
    "parentHash": "0xe75f82d86f51cdab5a2ed7b4e225c714d1fda7e0aa568c6b4618015ee6666506",
    "refereeHashes": [
      "0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39"
    ],
    "epochNumber": 449,
    "stable": null,
    "nonce": 17364797680136698000,
    "gas": 3000000000,
    "difficulty": "20000000",
    "height": 449,
    "size": 384,
    "blame": 0,
    "adaptive": false,
    "timestamp": 1571150247,
    "transactionsRoot": "0x2b8f5e08ca12eb66ae89f40a6b52938222ce835f0b786cae0befdbbecd8b55e1"
    "transactions": [
      "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
    ],
    "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
    "deferredReceiptsRoot": "0x522717233b96e0a03d85f02f8127aa0e23ef2e0865c95bb7ac577ee3754875e4",
    "deferredStateRoot": "0x39975f9bf46884e7c3c269577177af9a041c5e36a69ef2a4cf581f8a061fa911",
    "deferredStateRootWithAux": {
      "auxInfo": {
        "intermediateDeltaEpochId": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
        "previousSnapshotRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
      },
      "stateRoot": {
        "deltaRoot": "0x752a3f391da1a584812a9f50ec92542abda59c3cc0ad49741461471680cf1528",
        "intermediateDeltaRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
        "snapshotRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
      }
    },
   }

   * @example
   * > await cfx.getBlockByHash('0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40', true);
   {
    "hash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
    "transactions": [
      {
        "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
        "transactionIndex": 0,
        "hash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914",
        "nonce": 0,
        "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
        "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
        "value": "1000000000000000000"
        "data": "0x",
        "gas": 21000,
        "gasPrice": "819",
        "status": 0,
        "contractCreated": null,
        "r": "0x88e43a02a653d5895ffa5495718a5bd772cb157776108c5c22cee9beff890650",
        "s": "0x24e3ba1bb0d11c8b1da8d969ecd0c5e2372326a3de71ba1231c876c0efb2c0a8",
        "v": 0,
      }
    ],
    ...
   }
   */
  async getBlockByHash(blockHash, detail = false) {
    if (!lodash.isBoolean(detail)) {
      throw new Error('detail must be boolean');
    }
    const result = await this.provider.call('cfx_getBlockByHash', format.blockHash(blockHash), detail);
    return format.block.or(null)(result);
  }

  /**
   * Get block by `blockHash` if pivot block of `epochNumber` is `pivotBlockHash`.
   *
   * @param blockHash {string} - Block hash which epochNumber expect to be `epochNumber`.
   * @param pivotBlockHash {string} - Block hash which expect to be the pivot block of `epochNumber`.
   * @param epochNumber {number} - EpochNumber or string in ["latest_state", "latest_mined"]
   * @return {Promise<object>} The block info (same as `getBlockByHash`).
   *
   * @example
   * > await cfx.getBlockByHashWithPivotAssumption(
   * '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   * '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   * 449,
   * );
   {
     hash: '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
     ...
   }
   */
  async getBlockByHashWithPivotAssumption(blockHash, pivotBlockHash, epochNumber) {
    const result = await this.provider.call('cfx_getBlockByHashWithPivotAssumption',
      format.blockHash(blockHash), format.blockHash(pivotBlockHash), format.epochNumber(epochNumber),
    );
    return format.block(result);
  }

  // ----------------------------- transaction --------------------------------
  /**
   * Returns a transaction matching the given transaction hash.
   *
   * @param txHash {string} - The transaction hash.
   * @return {Promise<object|null>} Transaction info object
   * - `string` blockHash: Hash of the block where this transaction was in and got executed. `null` when its pending.
   * - `number` transactionIndex: Integer of the transactions index position in the block.
   * - `string` hash: Hash of the transaction.
   * - `number` nonce: The number of transactions made by the sender prior to this one.
   * - `string` from: Address of the sender.
   * - `string` to: Address of the receiver. null when its a contract creation transaction.
   * - `string` value: Value transferred in Drip.
   * - `string` data: The data send along with the transaction.
   * - `number` gas: Gas provided by the sender.
   * - `number` gasPrice: Gas price provided by the sender in Drip.
   * - `string` status: '0x0' successful execution; '0x1' exception happened but nonce still increased; '0x2' exception happened and nonce didn't increase.
   * - `string|null` contractCreated: The contract address created, if the transaction was a contract creation, otherwise null.
   * - `string` r: ECDSA signature r
   * - `string` s: ECDSA signature s
   * - `string` v: ECDSA recovery id
   *
   * @example
   * > await cfx.getTransactionByHash('0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914');
   {
      "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
      "transactionIndex": 0,
      "hash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914",
      "nonce": 0,
      "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
      "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
      "value": "1000000000000000000"
      "data": "0x",
      "gas": 21000,
      "gasPrice": "819",
      "status": 0,
      "contractCreated": null,
      "r": "0x88e43a02a653d5895ffa5495718a5bd772cb157776108c5c22cee9beff890650",
      "s": "0x24e3ba1bb0d11c8b1da8d969ecd0c5e2372326a3de71ba1231c876c0efb2c0a8",
      "v": 0,
    }
   */
  async getTransactionByHash(txHash) {
    const result = await this.provider.call('cfx_getTransactionByHash', format.txHash(txHash));
    return format.transaction.or(null)(result);
  }

  /**
   * Returns the receipt of a transaction by transaction hash.
   *
   * > Note: The receipt is not available for pending transactions and returns null.
   *
   * @param txHash {string} - The transaction hash.
   * @return {Promise<object|null>}
   * - `number` outcomeStatus: `0`: the transaction was successful, `1`: EVM reverted the transaction.
   * - `string` stateRoot: The state root of transaction execution.
   * - `number` epochNumber: EpochNumber where this transaction was in.
   * - `string` blockHash: Hash of the block where this transaction was in.
   * - `string` transactionHash: Hash of the transaction.
   * - `number` index: Integer of the transactions index position in the block.
   * - `string` from: Address of the sender.
   * - `string` to: Address of the receiver. null when its a contract creation transaction.
   * - `string|null` contractCreated: The contract address created, if the transaction was a contract creation, otherwise null.
   * - `number` gasUsed: The amount of gas used by this specific transaction alone.
   * - `[object]` logs: Array of log objects, which this transaction generated.
   * - `[string]` logs[].address: The address of the contract executing at the point of the `LOG` operation.
   * - `[string]` logs[].topics: The topics associated with the `LOG` operation.
   * - `[string]` logs[].data: The data associated with the `LOG` operation.
   * - `string` logsBloom: Log bloom.
   *
   * @example
   * > await cfx.getTransactionReceipt('0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914');
   {
    "outcomeStatus": 0,
    "stateRoot": "0x3854f64be6c124dffd0ddca57270846f0f43a119ea681b4e5d022ade537d9f07",
    "epochNumber": 449,
    "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
    "transactionHash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
    "index": 0,
    "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
    "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
    "contractCreated": null,
    "gasUsed": 21000,
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   }
   */
  async getTransactionReceipt(txHash) {
    const result = await this.provider.call('cfx_getTransactionReceipt', format.txHash(txHash));
    return format.receipt.or(null)(result);
  }

  /**
   * Creates new message call transaction or a contract creation, if the data field contains code.
   *
   * > FIXME: rpc `cfx_sendTransaction` not implement yet.
   *
   * > NOTE: if `from` options is a instance of `Account`, this methods will sign by account local and send by `cfx_sendRawTransaction`, else send by `cfx_sendTransaction`
   *
   * @param options {object} - See `format.sendTx`
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   *
   * @example
   * > // TODO call with address, need `cfx_sendTransaction`
   *
   * @example
   * > const account = cfx.wallet.add(KEY);
   * > await cfx.sendTransaction({
      from: account, // from account instance will sign by local.
      to: ADDRESS,
      value: Drip.fromCFX(0.023),
    });
   "0x459473cb019bb59b935abf5d6e76d66564aafa313efd3e337b4e1fa6bd022cc9"

   * @example
   * > await cfx.sendTransaction({
      from: account,
      to: account, // to account instance
      value: Drip.fromCFX(0.03),
    }).get(); // send then get transaction by hash.
   {
    "blockHash": null,
    "transactionIndex": null,
    "hash": "0xf2b258b49d33dd22419526e168ebb79b822889cf8317ce1796e816cce79e49a2",
    "contractCreated": null,
    "data": "0x",
    "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "nonce": 111,
    "status": null,
    "to": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "value": "30000000000000000",
    ...
   }

   * @example
   * > const promise = cfx.sendTransaction({ // Not await here, just get promise
      from: account1,
      to: ADDRESS1,
      value: Drip.fromCFX(0.007),
    });

   * > await promise; // transaction
   "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688"

   * > await promise.get(); // get transaction
   {
    "blockHash": null,
    "transactionIndex": null,
    "hash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    ...
   }

   * > await promise.mined(); // wait till transaction mined
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "transactionIndex": 0,
    "hash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    ...
   }

   * > await promise.executed(); // wait till transaction executed in right status. and return it's receipt.
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "index": 0,
    "transactionHash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    "outcomeStatus": 0,
    ...
   }

   * > await promise.confirmed(); // wait till transaction risk coefficient '<' threshold.
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "index": 0,
    "transactionHash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    "outcomeStatus": 0,
    ...
   }
   */
  async sendTransaction(options) {
    if (options.gasPrice === undefined) {
      options.gasPrice = this.defaultGasPrice;
    }

    if (options.gas === undefined) {
      options.gas = this.defaultGas;
    }

    if (options.nonce === undefined) {
      options.nonce = await this.getTransactionCount(options.from);
    }

    if (options.from instanceof Wallet.Account) {
      // sign by local
      const tx = options.from.signTransaction(options);
      return this.sendRawTransaction(tx.serialize());
    }

    // sign by remote
    return this.provider.call('cfx_sendTransaction', format.sendTx(options));
  }

  /**
   * Signs a transaction. This account needs to be unlocked.
   *
   * @param hex {string|Buffer} - Raw transaction string.
   * @return {Promise<PendingTransaction>} The PendingTransaction object. See `sendTransaction`
   *
   * @example
   * > await cfx.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
   */
  async sendRawTransaction(hex) {
    return this.provider.call('cfx_sendRawTransaction', format.hex(hex));
  }

  // ------------------------------ contract ----------------------------------
  /**
   * Get the code at a specific address.
   *
   * @param address {string} - The contract address to get the code from.
   * @param [epochNumber=this.defaultEpoch] {string|number} - EpochNumber or string in ["latest_state", "latest_mined"]
   * @return {Promise<string>} Code hex string
   *
   * @example
   * > await cfx.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
   */
  async getCode(address, epochNumber = this.defaultEpoch) {
    return this.provider.call('cfx_getCode', format.address(address), format.epochNumber(epochNumber));
  }

  /**
   * Executes a message call transaction, which is directly executed in the VM of the node,
   * but never mined into the block chain.
   *
   * @param options {object} - See `format.sendTx`
   * @param [epochNumber=this.defaultEpoch] {string|number} - The end epochNumber to execute call of.
   * @return {Promise<string>} Hex bytes the contract method return.
   */
  async call(options, epochNumber = this.defaultEpoch) {
    if (options.gasPrice === undefined) {
      options.gasPrice = this.defaultGasPrice;
    }

    if (options.gas === undefined) {
      options.gas = this.defaultGas;
    }

    if (options.from && options.nonce === undefined) {
      options.nonce = await this.getTransactionCount(options.from);
    }

    return this.provider.call('cfx_call', format.callTx(options), format.epochNumber(epochNumber));
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   *
   * @param options {object} - See `format.estimateTx`
   * @return {Promise<BigNumber>} The used gas for the simulated call/transaction.
   */
  async estimateGas(options) {
    if (options.gasPrice === undefined) {
      options.gasPrice = this.defaultGasPrice;
    }

    if (options.gas === undefined) {
      options.gas = this.defaultGas;
    }

    if (options.from && options.nonce === undefined) {
      options.nonce = await this.getTransactionCount(options.from);
    }

    const result = await this.provider.call('cfx_estimateGas', format.estimateTx(options));
    return format.bigNumber(result);
  }
}

module.exports = Conflux;
