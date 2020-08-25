const { decorate } = require('./util');
const format = require('./util/format');
const providerFactory = require('./provider');
const Contract = require('./contract');
const Account = require('./Account');
const { PendingTransaction, LogIterator } = require('./subscribe');

/**
 * A sdk of conflux.
 */
class Conflux {
  /**
   * @param [options] {object} - Conflux and Provider constructor options.
   * @param [options.url=''] {string} - Url of provider to create.
   * @param [options.defaultGasPrice] {string|number} - The default gas price in drip to use for transactions.
   * @example
   * > const { Conflux } = require('js-conflux-sdk');
   * > const cfx = new Conflux({url:'http://testnet-jsonrpc.conflux-chain.org:12537'});
   *
   * @example
   * > const cfx = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
   */
  constructor({
    url = '',
    defaultGasPrice,
    ...rest
  } = {}) {
    this.provider = this.setProvider(url, rest);

    /**
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     *
     * @deprecated
     * @type {number|string}
     */
    this.defaultGasPrice = defaultGasPrice;

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
   * A shout cut for `new Account(privateKey);`
   *
   * @param privateKey {string|Buffer} - See [Account.constructor](#Account.js/constructor)
   * @return {Account}
   */
  Account(privateKey) {
    return new Account(privateKey);
  }

  /**
   * A shout cut for `new Contract(cfx, options);`
   *
   * @param options {object} - See [Contract.constructor](#Contract.js/constructor)
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
   * Get status
   * @return {Promise<object>} Status information object
   * - `number` chainId: Chain id
   * - `number` epochNumber: Epoch number
   * - `number` blockNumber: Block number
   * - `number` pendingTxNumber: Pending transaction number
   * - `string` bestHash: The block hash of best pivot block
   */
  async getStatus() {
    const result = await this.provider.call('cfx_getStatus');
    return format.status(result);
  }

  /**
   * Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.
   *
   * @return {Promise<JSBI>} Gas price in drip.
   *
   * @example
   * > await cfx.getGasPrice();
   "0"
   */
  async getGasPrice() {
    const result = await this.provider.call('cfx_gasPrice');
    return format.bigUInt(result);
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
  async getEpochNumber(epochNumber) {
    const result = await this.provider.call('cfx_epochNumber',
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.uInt(result);
  }

  /**
   * Gets past logs, matching the given options.
   *
   * @param [options] {object}
   * @param [options.fromEpoch] {string|number} - The number of the start block(>=), 'latest_mined' or 'latest_state'.
   * @param [options.toEpoch] {string|number} - The number of the stop block(<=), 'latest_mined' or 'latest_state'.
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
      throw new Error('OverrideError, do not use `blockHashes` with `fromEpoch` or `toEpoch`, cause only `blockHashes` will take effect');
    }

    const result = await this.provider.call('cfx_getLogs', format.getLogs(options));

    return format.logs(result);
  }

  // ------------------------------- address ----------------------------------
  /**
   * Get the balance of an address at a given epochNumber.
   *
   * @param address {string} - The address to get the balance of.
   * @param [epochNumber] {string|number} - The end epochNumber to count balance of.
   * @return {Promise<JSBI>} Address balance number in drip.
   *
   * @example
   * > let balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   * > balance.toString();
   "1793636034970586632"

   * > balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
   * > balance.toString(10);
   "0"
   */
  async getBalance(address, epochNumber) {
    const result = await this.provider.call('cfx_getBalance',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Get the address next transaction nonce.
   *
   * @param address {string} - The address to get the numbers of transactions from.
   * @param [epochNumber] {string|number} - The end epochNumber to count transaction of.
   * @return {Promise<number>}
   *
   * @example
   * > await cfx.getNextNonce("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   61

   * > await cfx.getNextNonce("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
   0
   */
  async getNextNonce(address, epochNumber) {
    const result = await this.provider.call('cfx_getNextNonce',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the admin of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber] {string|number} - Integer epoch number, or the string.
   * @return {Promise<string>} Admin address
   *
   * @example
   * > cfx.getAdmin('0x89996a8aefb2228593aae723d47f9517eef1341d')
   "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8"

   > cfx.getAdmin('0x89996a8aefb2228593aae723d47f9517eef1341d', 0)
   RPCError: State for epoch (number=0 hash=0x972b57382a823b5266d41a8bee9c39d12471293a9bb6472f6df75a99ce2df468) does not exist
   */
  async getAdmin(address, epochNumber) {
    return this.provider.call('cfx_getAdmin',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
  }

  /**
   * Returns the size of the collateral storage of given address, in Byte.
   *
   * @param address {string} - Address to check for collateral storage.
   * @param epochNumber - Integer epoch number, or the string.
   * @return {Promise<JSBI>} - Integer of the collateral storage in Byte.
   *
   * @example
   * > storage = await cfx.getCollateralForStorage(address)
   * > storage.toString()
   "0"
   */
  async getCollateralForStorage(address, epochNumber) {
    const result = await this.provider.call('cfx_getCollateralForStorage',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  // -------------------------------- epoch -----------------------------------
  /**
   * Get the risk of the block could be reverted.
   * All block in one same epoch returned same risk number
   *
   * @param blockHash {string}
   * @return {Promise<number|null>}
   */
  async getConfirmationRiskByHash(blockHash) {
    const result = await this.provider.call('cfx_getConfirmationRiskByHash',
      format.blockHash(blockHash),
    );
    return format.riskNumber(result);
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
    const result = await this.provider.call('cfx_getBlockByEpochNumber',
      format.epochNumber(epochNumber),
      format.boolean(detail),
    );
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
    return this.provider.call('cfx_getBlocksByEpoch',
      format.epochNumber(epochNumber),
    );
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
   * > await cfx.getBlockByHash('0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80');
   {
      epochNumber: 231939,
      height: 231939,
      size: 384,
      timestamp: 1578972801,
      gasLimit: 3000000000n,
      difficulty: 29649377n,
      transactions: [
        '0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530'
      ],
      stable: true,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c',
      deferredStateRoot: '0xa930f70fc49e1ab5441031775138817ff951421fad1298b69cda26a10f1fe2b9',
      hash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
      miner: '0x0000000000000000000000000000000000000014',
      nonce: '0xd7adc50635950329',
      parentHash: '0xd601491dc9e0f80ceccbf0142490fcb47a4e1801d6fcea34119ffc338b59712c',
      refereeHashes: [
        '0x6826206c6eaa60a6950182f90d2a608c07c7af6802131204f7365c1e96b1f85c'
      ],
      transactionsRoot: '0xe26c8940951305914fa69b0a8e431255962cfe95f2481283ec08437eceec03e2'
    }

   * @example
   * > await cfx.getBlockByHash('0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40', true);
   {
    hash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
    transactions: [
      {
        nonce: 1,
        value: 0n,
        gasPrice: 10n,
        gas: 10000000n,
        v: 1,
        transactionIndex: 0,
        status: 0,
        blockHash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
        contractCreated: null,
        data: '0x47e7ef2400000000000000000000000099b52de54f2f922fbd6e46d99654d2063bd7f0dc00000000000000000000000000000000000000000000000000000000000003e8',
        from: '0x99b52de54f2f922fbd6e46d99654d2063bd7f0dc',
        hash: '0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530',
        r: '0xdc383e4afb5b389e4074e6d4acbb847fd0908bbca60602d66e60169f1340630',
        s: '0x14efbc60c095b507609639b219d233418a7fc7ee835902e69e1735897b45fb38',
        to: '0x28d995f3818426dbbe8e357cc1cdb67be043b0df'
      }
    ],
    ...
   }
   */
  async getBlockByHash(blockHash, detail = false) {
    const result = await this.provider.call('cfx_getBlockByHash',
      format.blockHash(blockHash),
      format.boolean(detail),
    );
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
   '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   449,
   );
   {
     hash: '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
     ...
   }
   */
  async getBlockByHashWithPivotAssumption(blockHash, pivotBlockHash, epochNumber) {
    const result = await this.provider.call('cfx_getBlockByHashWithPivotAssumption',
      format.blockHash(blockHash),
      format.blockHash(pivotBlockHash),
      format.epochNumber(epochNumber),
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
    const result = await this.provider.call('cfx_getTransactionByHash',
      format.txHash(txHash),
    );
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
    const result = await this.provider.call('cfx_getTransactionReceipt',
      format.txHash(txHash),
    );
    return format.receipt.or(null)(result);
  }

  /**
   * Creates new message call transaction or a contract creation, if the data field contains code.
   *
   * > FIXME: rpc `cfx_sendTransaction` not implement yet.
   *
   * > NOTE: if `from` options is a instance of `Account`, this methods will sign by account local and send by `cfx_sendRawTransaction`, else send by `cfx_sendTransaction`
   *
   * @param options {object} - See [format.sendTx](#util/format.js/sendTx)
   * @param password {string} - Password for remote node.
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   *
   * @example
   * > // TODO call with address, need `cfx_sendTransaction`
   *
   * @example
   * > const account = cfx.Account(KEY);
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
  async sendTransaction({ ...options }, password) { // shallow copy `options`
    if (!(options.from instanceof Account)) {
      options.from = new Account(options.from);
    }

    if (options.nonce === undefined) {
      options.nonce = await this.getNextNonce(options.from);
    }

    if (options.gasPrice === undefined) {
      options.gasPrice = this.defaultGasPrice;
    }
    if (options.gasPrice === undefined) {
      options.gasPrice = await this.getGasPrice() || 1; // MIN_GAS_PRICE
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      const { gasUsed, storageCollateralized } = await this.estimateGasAndCollateral(options);

      if (options.gas === undefined) {
        options.gas = gasUsed;
      }

      if (options.storageLimit === undefined) {
        options.storageLimit = storageCollateralized;
      }
    }

    if (options.epochHeight === undefined) {
      options.epochHeight = await this.getEpochNumber();
    }

    if (options.chainId === undefined) {
      const status = await this.getStatus();
      options.chainId = status.chainId;
    }

    if (options.from.privateKey) {
      // sign by local
      const tx = options.from.signTransaction(options);
      return this.sendRawTransaction(tx.serialize());
    } else {
      // sign by remote
      return this.provider.call('cfx_sendTransaction', format.sendTx(options), password);
    }
  }

  /**
   * Signs a transaction. This account needs to be unlocked.
   *
   * @param hex {string|Buffer} - Raw transaction string.
   * @return {Promise<PendingTransaction>} The PendingTransaction object. See [sendTransaction](#Conflux.js/sendTransaction)
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
   * @param [epochNumber] {string|number} - EpochNumber or string in ["latest_state", "latest_mined"]
   * @return {Promise<string>} Code hex string
   *
   * @example
   * > await cfx.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
   */
  async getCode(address, epochNumber) {
    return this.provider.call('cfx_getCode',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
  }

  /**
   * Executes a message call transaction, which is directly executed in the VM of the node,
   * but never mined into the block chain.
   *
   * @param options {object} - See [format.sendTx](#util/format.js/sendTx)
   * @param [epochNumber] {string|number} - The end epochNumber to execute call of.
   * @return {Promise<string>} Hex bytes the contract method return.
   */
  async call({ ...options }, epochNumber) { // shallow copy `options`
    if (options && options.from !== undefined) {
      options.from = new Account(options.from);
    }

    return this.provider.call('cfx_call',
      format.callTx(options),
      format.epochNumber.or(undefined)(epochNumber),
    );
  }

  /**
   * Executes a message call or transaction and returns the amount of the gas used.
   *
   * @param options {object} - See [format.estimateTx](#util/format.js/estimateTx)
   * @return {Promise<object>} The gas used and storage occupied for the simulated call/transaction.
   * - `BigInt` gasUsed: The gas used.
   * - `BigInt` storageCollateralized: The storage collateralized in Byte.
   */
  async estimateGasAndCollateral({ ...options }) { // shallow copy `options`
    if (options && options.from !== undefined) {
      options.from = new Account(options.from);
    }

    const result = await this.provider.call('cfx_estimateGasAndCollateral',
      format.estimateTx(options),
    );
    return format.estimate(result);
  }
}

module.exports = Conflux;
