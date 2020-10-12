const { assert } = require('./util');
const format = require('./util/format');
const providerFactory = require('./provider');
const Wallet = require('./wallet');
const Contract = require('./contract');
const internalContract = require('./contract/internal');
const PendingTransaction = require('./subscribe/PendingTransaction');
const Subscription = require('./subscribe/Subscription');

/**
 * A sdk of conflux.
 */
class Conflux {
  /**
   * @param [options] {object} - Conflux and Provider constructor options.
   * @param [options.url] {string} - Url of Conflux node to connect.
   * @param [options.defaultGasPrice] {string|number} - The default gas price in drip to use for transactions.
   * @param [options.logger] {Object} - Logger object with 'info' and 'error' method.
   * @example
   * > const { Conflux } = require('js-conflux-sdk');
   * > const conflux = new Conflux({url:'http://testnet-jsonrpc.conflux-chain.org:12537'});
   *
   * @example
   * > const conflux = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
   */
  constructor({ defaultGasPrice, ...rest } = {}) {
    /**
     * Provider for rpc call
     *
     * @type {WebsocketProvider|HttpProvider|BaseProvider}
     */
    this.provider = providerFactory(rest);

    /**
     * Wallet for `sendTransaction` to get `Account` by `from` field
     *
     * @type {Wallet}
     */
    this.wallet = new Wallet();

    /**
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     *
     * @deprecated
     * @type {number|string}
     */
    this.defaultGasPrice = defaultGasPrice;

    this.sendRawTransaction = this._decoratePendingTransaction(this.sendRawTransaction);
    this.sendTransaction = this._decoratePendingTransaction(this.sendTransaction);
  }

  _decoratePendingTransaction(func) {
    const conflux = this;
    return function (...args) {
      return new PendingTransaction(conflux, func.bind(this), args);
    };
  }

  /**
   * A shout cut for `new Contract(options, conflux);`
   *
   * @param options {object} - See [Contract.constructor](#Contract.js/constructor)
   * @return {Contract} - A Contract instance
   */
  Contract(options) {
    return new Contract(options, this);
  }

  /**
   * Create internal contract by default abi and address
   *
   * - [AdminControl](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/AdminControl.sol)
   * - [SponsorWhitelistControl](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/SponsorWhitelistControl.sol)
   * - [Staking](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/Staking.sol)
   *
   * @param name {"AdminControl"|"SponsorWhitelistControl"|"Staking"} Internal contract name
   * @return {Contract}
   *
   * @example
   * > conflux.InternalContract('AdminControl')
   {
    constructor: [Function: bound call],
    abi: ContractABI { * },
    address: '0x0888000000000000000000000000000000000000',
    destroy: [Function: bound call],
    getAdmin: [Function: bound call],
    setAdmin: [Function: bound call],
    'destroy(address)': [Function: bound call],
    '0x00f55d9d': [Function: bound call],
    'getAdmin(address)': [Function: bound call],
    '0x64efb22b': [Function: bound call],
    'setAdmin(address,address)': [Function: bound call],
    '0xc55b6bb7': [Function: bound call]
  }
   */
  InternalContract(name) {
    const options = internalContract[name];
    assert(options, `can not find internal contract named "${name}"`);
    return this.Contract(options);
  }

  /**
   * close connection.
   *
   * @example
   * > conflux.close();
   */
  close() {
    this.provider.close();
  }

  // --------------------------------------------------------------------------
  /**
   * Get node client version
   *
   * @private
   * @return {Promise<string>}
   */
  async getClientVersion() {
    return this.provider.call('cfx_clientVersion');
  }

  /**
   * Get status
   * @return {Promise<object>} Status information object
   * - `number` chainId: Chain id
   * - `number` epochNumber: Epoch number
   * - `number` blockNumber: Block number
   * - `number` pendingTxNumber: Pending transaction number
   * - `string` bestHash: The block hash of best pivot block
   *
   * @example
   * > await conflux.getStatus()
   {
      "chainId": 2,
      "epochNumber": 324105,
      "blockNumber": 426341,
      "pendingTxNumber": 40,
      "bestHash": "0xef08f2702335f149afc021607511ffae49df8bb56b2afb7f42de02d9cbbf7ef6"
   }
   */
  async getStatus() {
    const result = await this.provider.call('cfx_getStatus');
    return format.status(result);
  }

  /**
   * Returns the current price per gas in Drip.
   *
   * @return {Promise<BigInt>} Gas price in drip.
   *
   * @example
   * > await conflux.getGasPrice();
   '1'
   */
  async getGasPrice() {
    const result = await this.provider.call('cfx_gasPrice');
    return format.bigUIntDec(result);
  }

  /**
   * Returns the interest rate of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<BigInt>} The interest rate of given parameter.
   *
   * @example
   * > await conflux.getInterestRate();
   "2522880000000"
   */
  async getInterestRate(epochNumber) {
    const result = await this.provider.call('cfx_getInterestRate',
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUIntDec(result);
  }

  /**
   * Returns the accumulate interest rate of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<BigInt>} The accumulate interest rate of given parameter.
   *
   * @example
   * > await conflux.getAccumulateInterestRate()
   "76269979767787603657181926319926"
   */
  async getAccumulateInterestRate(epochNumber) {
    const result = await this.provider.call('cfx_getAccumulateInterestRate',
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUIntDec(result);
  }

  // ------------------------------- address ----------------------------------
  /**
   * Return account related states of the given account
   *
   * @param address {string} - address to get account.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<object>} Return the states of the given account:
   * balance `BigInt`: the balance of the account.
   * nonce `BigInt`: the nonce of the account's next transaction.
   * codeHash `string`: the code hash of the account.
   * stakingBalance `BigInt`: the staking balance of the account.
   * collateralForStorage `BigInt`: the collateral storage of the account.
   * accumulatedInterestReturn `BigInt`: accumulated unterest return of the account.
   * admin `string`: admin of the account.
   *
   * @example
   > await conflux.getAccount('0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
   {
    "accumulatedInterestReturn": "0",
    "balance": "0",
    "collateralForStorage": "0",
    "nonce": "0",
    "stakingBalance": "0",
    "admin": "0x0000000000000000000000000000000000000000",
    "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
   }
   */
  async getAccount(address, epochNumber) {
    const result = await this.provider.call('cfx_getAccount',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.account(result);
  }

  /**
   * Returns the balance of the account of given address.
   *
   * @param address {string} - The address to get the balance of.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<BigInt>} The balance in Drip.
   *
   * @example
   * > await conflux.getBalance("0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   '10098788868004995614504'
   */
  async getBalance(address, epochNumber) {
    const result = await this.provider.call('cfx_getBalance',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUIntDec(result);
  }

  /**
   * Returns the balance of the staking account of given address.
   *
   * @param address {string} - Address to check for staking balance.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<BigInt>} The staking balance in Drip.
   *
   * @example
   * > await conflux.getStakingBalance('0x194770007dda54cF92009BFF0dE90c06F603a09f', 'latest_state');
   '6334100968004995614504'
   */
  async getStakingBalance(address, epochNumber) {
    const result = await this.provider.call('cfx_getStakingBalance',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUIntDec(result);
  }

  /**
   * Returns the next nonce should be used by given address.
   *
   * @param address {string} - The address to get the numbers of transactions from.
   * @param [epochNumber] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<BigInt>} The next nonce should be used by given address.
   *
   * @example
   * > await conflux.getNextNonce("0x1be45681ac6c53d5a40475f7526bac1fe7590fb8");
   "3"
   */
  async getNextNonce(address, epochNumber) {
    const result = await this.provider.call('cfx_getNextNonce',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUIntDec(result);
  }

  /**
   * Returns the admin of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<string>} Address to admin, or `null` if the contract does not exist.
   *
   * @example
   * > conflux.getAdmin('0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f')
   "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c"
   */
  async getAdmin(address, epochNumber) {
    return this.provider.call('cfx_getAdmin',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  // -------------------------------- epoch -----------------------------------
  /**
   * Returns the epoch number of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<number>} integer of the current epoch number of given parameter.
   *
   * @example
   * > await conflux.getEpochNumber();
   443
   */
  async getEpochNumber(epochNumber) {
    const result = await this.provider.call('cfx_epochNumber',
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.uInt(result);
  }

  /**
   * Returns information about a block by epoch number.
   *
   * @param epochNumber {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @param [detail=false] {boolean} - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
   * @return {Promise<object|null>} See `getBlockByHash`
   *
   * @example
   * > await conflux.getBlockByEpochNumber('latest_mined', true);
   {...}
   */
  async getBlockByEpochNumber(epochNumber, detail = false) {
    const result = await this.provider.call('cfx_getBlockByEpochNumber',
      format.epochNumber(epochNumber),
      format.boolean(detail),
    );
    return format.block.$or(null)(result);
  }

  /**
   * Returns hashes of blocks located in some epoch.
   *
   * @param epochNumber {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<string[]>} Array of block hashes, sorted by execution(topological) order.
   *
   * @example
   * > await conflux.getBlocksByEpochNumber(0);
   ['0xe677ae5206a5d67d9efa183d867b4b986ed82a3e62174a1488cf8364d58534ec']
   */
  async getBlocksByEpochNumber(epochNumber) {
    return this.provider.call('cfx_getBlocksByEpoch',
      format.epochNumber(epochNumber),
    );
  }

  /**
   * Get epoch blocks reward info
   *
   * @private
   * @param epochNumber {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<object[]>} List of block reward info
   * - blockHash `string`: Hash of the block.
   * - author `string`: The address of the beneficiary to whom the mining rewards were given.
   * - baseReward `BigInt`: Block base reward in `Drip`
   * - totalReward `BigInt`: Block total reward in `Drip`
   * - txFee `BigInt`: Total gas fee of block transaction
   *
   * @example
   * > await conflux.getBlockRewardInfo(4060000);
   [
   {
      "baseReward": "11295480000000000000",
      "totalReward": "11295509726193823715",
      "txFee": "0",
      "author": "0x13bbe31525cb9ed1461d3277c4413c854d9f8355",
      "blockHash": "0x305c0a205af135ffca55a6ffb9569cbf93451ea3b7211b8f0ae39c147f3320e8"
    },
   {
      "baseReward": "11300000000000000000",
      "totalReward": "11300029738091185588",
      "txFee": "2126250",
      "author": "0x1a84009b2f981155b98bb7e10aa0965fbc169be7",
      "blockHash": "0xfc75086a3a752d742673859d371061e8a59c85a54e90f13914b62c20364a2150"
    }
   ]
   */
  async getBlockRewardInfo(epochNumber) {
    const result = await this.provider.call('cfx_getBlockRewardInfo',
      format.epochNumber(epochNumber),
    );
    return format.rewardInfo(result);
  }

  // -------------------------------- block -----------------------------------
  /**
   * Returns the hash of best block.
   *
   * @return {Promise<string>} hash of the best block.
   *
   * @example
   * > await conflux.getBestBlockHash();
   "0xb8bb355bfeaf055a032d5b7df719917c090ee4fb6fee42383004dfe8911d7daf"
   */
  async getBestBlockHash() {
    return this.provider.call('cfx_getBestBlockHash');
  }

  /**
   * Returns information about a block by hash.
   *
   * @param blockHash {string} - hash of a block.
   * @param [detail=false] {boolean} - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
   * @return {Promise<object|null>} A block object, or null when no block was found:
   * - adaptive `boolean`: If `true` the weight of the block is adaptive under GHAST rule, if `false` otherwise.
   * - blame `number`: If 0, then no blocks are blamed on its parent path, If greater than 0, then the nearest blamed block on the parent path is blame steps away.
   * - deferredLogsBloomHash `string`: The bloom hash of deferred logs.
   * - deferredReceiptsRoot `string`: The hash of the receipts of the block after deferred execution.
   * - deferredStateRoot `string`: The root of the final state trie of the block after deferred execution.
   * - difficulty `string`: Integer string of the difficulty for this block.
   * - epochNumber `number|null`: The current block epoch number in the client's view. null when it's not in best block's past set and the epoch number is not determined.
   * - gasLimit `BigInt`: The maximum gas allowed in this block.
   * - hash `string|null`: Hash of the block. `null` when its pending block.
   * - height `number`: The block heights. `null` when its pending block.
   * - miner `string`: The address of the beneficiary to whom the mining rewards were given.
   * - nonce `string`: Hash of the generated proof-of-work. `null` when its pending block.
   * - parentHash `string`: Hash of the parent block.
   * - powQuality `string`:Hash of the generated proof-of-work. `null` when its pending block.
   * - refereeHashes `string[]`: Array of referee hashes.
   * - size `number`: Integer the size of this block in bytes.
   * - timestamp `number`: The unix timestamp for when the block was collated.
   * - transactions `string[]|object[]`: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
   * - transactionsRoot `string`: The hash of the transactions of the block.
   *
   * @example
   * > await conflux.getBlockByHash('0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7');
   {
      "epochNumber": 455,
      "blame": 0,
      "height": 455,
      "size": 122,
      "timestamp": 1594912954,
      "gasLimit": "30000000",
      "difficulty": "30000",
      "transactions": [
        "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8"
      ],
      "adaptive": false,
      "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
      "deferredReceiptsRoot": "0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508",
      "deferredStateRoot": "0x2124f4f35df1abeb01a43ed25c6b7ea5a56bbc2bdb3ab3feb096e3911e522181",
      "hash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "miner": "0x100000000000000000000000000000000000007c",
      "nonce": "0xcc2eadd8c5c369ff",
      "parentHash": "0x9ced22205ac0fe96ad27be9c0add073ce49582220b8fd1006edf16a402aef9b4",
      "powQuality": "0x167d3",
      "refereeHashes": [],
      "transactionsRoot": "0x5a31184b86d8b88a3860649c17a4b7b4d3c7ef35fea971afb1f44081feff5b60"
    }
   */
  async getBlockByHash(blockHash, detail = false) {
    const result = await this.provider.call('cfx_getBlockByHash',
      format.blockHash(blockHash),
      format.boolean(detail),
    );
    return format.block.$or(null)(result);
  }

  /**
   * Get block by `blockHash` if pivot block of `epochNumber` is `pivotBlockHash`.
   *
   * @private
   * @param blockHash {string} - Block hash which epochNumber expect to be `epochNumber`.
   * @param pivotBlockHash {string} - Block hash which expect to be the pivot block of `epochNumber`.
   * @param epochNumber {number} - Epoch number
   * @return {Promise<object>} See `getBlockByHash`
   */
  async getBlockByHashWithPivotAssumption(blockHash, pivotBlockHash, epochNumber) {
    const result = await this.provider.call('cfx_getBlockByHashWithPivotAssumption',
      format.blockHash(blockHash),
      format.blockHash(pivotBlockHash),
      format.epochNumber(epochNumber),
    );
    return format.block(result);
  }

  /**
   * Get the risk of the block could be reverted.
   * All block in one same epoch returned same risk number
   *
   * @param blockHash {string} - Hash of a block
   * @return {Promise<number|null>} Number >0 and <1
   *
   * @example
   * > await conflux.getConfirmationRiskByHash('0x24dcc768132dc7f651d7cb35c52e7bba632eda073d8743f81cfe905ff7e4157a')
   1e-8
   */
  async getConfirmationRiskByHash(blockHash) {
    const result = await this.provider.call('cfx_getConfirmationRiskByHash',
      format.blockHash(blockHash),
    );
    return format.riskNumber.$or(null)(result);
  }

  // ----------------------------- transaction --------------------------------
  /**
   * Returns the information about a transaction requested by transaction hash.
   *
   * @param transactionHash {string} - hash of a transaction
   * @return {Promise<object|null>} transaction object, or `null` when no transaction was found:
   * - blockHash `string`: hash of the block where this transaction was in and got executed. `null` when its pending.
   * - contractCreated `string|null`: address of created contract. `null` when it's not a contract creating transaction
   * - data `string`: the data send along with the transaction.
   * - epochHeight `number`: TODO
   * - from `string`: address of the sender.
   * - gas `BigInt`: gas provided by the sender.
   * - gasPrice `number`: gas price provided by the sender in Drip.
   * - hash `string`: hash of the transaction.
   * - nonce `BigInt`: the number of transactions made by the sender prior to this one.
   * - r `string`: ECDSA signature r
   * - s `string`: ECDSA signature s
   * - status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
   * - storageLimit `BigInt`: TODO
   * - chainId `number`: TODO
   * - to `string`: address of the receiver. null when its a contract creation transaction.
   * - transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
   * - v `string`: ECDSA recovery id
   * - value `BigInt`: value transferred in Drip.
   *
   * @example
   * > await conflux.getTransactionByHash('0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8');
   {
      "nonce": "0",
      "value": "1000000000000000000000000000000000",
      "gasPrice": "3",
      "gas": "16777216",
      "v": 1,
      "transactionIndex": 0,
      "status": 0,
      "storageLimit": "65536",
      "chainId": 2,
      "epochHeight": 454,
      "blockHash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "contractCreated": null,
      "data": "0x",
      "from": "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8",
      "hash": "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8",
      "r": "0x85f6729aa1e709202318bd6746c4a232a379eaa4cd9c2ea24c7babdbd09085cd",
      "s": "0x7101e1e2ee4ddfcef8879358df0cb0792f34712116f100b76c8e9582625acd2f",
      "to": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c"
   }
   */
  async getTransactionByHash(transactionHash) {
    const result = await this.provider.call('cfx_getTransactionByHash',
      format.transactionHash(transactionHash),
    );
    return format.transaction.$or(null)(result);
  }

  /**
   * Returns the information about a transaction receipt requested by transaction hash.
   *
   * @param transactionHash {string} - Hash of a transaction
   * @return {Promise<object|null>} A transaction receipt object, or null when no transaction was found or the transaction was not executed yet:
   * - transactionHash `string`: Hash of the given transaction.
   * - index `number`: Transaction index within the block.
   * - blockHash `string`: Hash of the block where this transaction was in and got executed.
   * - epochNumber `number`: Epoch number of the block where this transaction was in and got executed.
   * - from `string`: Address of the sender.
   * - to `string`: Address of the receiver. `null` when its a contract creation transaction.
   * - gasUsed `number`: Gas used the transaction.
   * - contractCreated `string|null`: Address of created contract. `null` when it's not a contract creating transaction.
   * - stateRoot `string`: Hash of the state root.
   * - outcomeStatus `number`:  the outcome status code, 0 was successful, 1 for an error occurred in the execution.
   * - logsBloom `string`: Bloom filter for light clients to quickly retrieve related logs.
   * - logs `object[]`: Array of log objects, which this transaction generated.
   *
   * @example
   * > await conflux.getTransactionReceipt('0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8');
   {
      "index": 0,
      "epochNumber": 455,
      "outcomeStatus": 0,
      "gasUsed": "21000",
      "gasFee": "37748736",
      "blockHash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "contractCreated": null,
      "from": "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "stateRoot": "0x19d109e6fe9f5a75cc54543af4beab08c0f23fdf95eea33b1afe5a9ef8b770dc",
      "to": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c",
      "transactionHash": "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8"
    }
   */
  async getTransactionReceipt(transactionHash) {
    const result = await this.provider.call('cfx_getTransactionReceipt',
      format.transactionHash(transactionHash),
    );
    return format.receipt.$or(null)(result);
  }

  /**
   * Creates new message call transaction or a contract creation for signed transactions.
   *
   * @param hex {string|Buffer} - The signed transaction data.
   * @return {Promise<PendingTransaction>} The transaction hash, or the zero hash if the transaction is not yet available.
   *
   * @example
   * > await conflux.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
   */
  async sendRawTransaction(hex) {
    return this.provider.call('cfx_sendRawTransaction',
      format.hex(hex),
    );
  }

  /**
   * Create `Transaction` and sign by account which key by `from` filed in `conflux.wallet`, then send transaction
   *
   * @private
   * @param options {object}
   * @param options.from {string} - Key of account in conflux.wallet
   * @return {Promise<Transaction>}
   */
  async _signTransaction(options) {
    const account = await this.wallet.get(`${options.from}`);

    if (options.nonce === undefined) {
      options.nonce = await this.getNextNonce(account);
    }

    if (options.chainId === undefined) {
      const status = await this.getStatus();
      options.chainId = status.chainId;
    }

    if (options.epochHeight === undefined) {
      options.epochHeight = await this.getEpochNumber();
    }

    if (options.gasPrice === undefined) {
      if (this.defaultGasPrice === undefined) {
        options.gasPrice = await this.getGasPrice() || 1; // MIN_GAS_PRICE
      } else {
        options.gasPrice = this.defaultGasPrice;
      }
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      let gas;
      let storageLimit;

      if (options.data) {
        const { gasUsed, storageCollateralized } = await this.estimateGasAndCollateral(options);
        gas = gasUsed;
        storageLimit = storageCollateralized;
      } else {
        gas = 21000; // TX_GAS
        storageLimit = 0; // TX_STORAGE_LIMIT
      }

      if (options.gas === undefined) {
        options.gas = gas;
      }

      if (options.storageLimit === undefined) {
        options.storageLimit = storageLimit;
      }
    }

    return account.signTransaction(options);
  }

  /**
   * Sign and send transaction
   * if `from` field in `conflux.wallet`, sign by local account and send raw transaction,
   * else call `cfx_sendTransaction` and sign by remote wallet
   *
   * @param options {object} - See [format.sendTx](#util/format.js/sendTx)
   * @param password {string} - Password for remote node.
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   *
   * @example
   * > txHash = await conflux.sendTransaction({from:account, to:address, value:0}); // send and get transaction hash
   "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"

   * @example
   * > packedTx = await conflux.sendTransaction({from:account, to:address, value:0}).get(); // await till transaction packed
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
   * > minedTx = await conflux.sendTransaction({from:account, to:address, value:0}).mined(); // await till transaction mined
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
   * > executedReceipt = await conflux.sendTransaction({from:account, to:address, value:0}).executed(); // await till transaction executed
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
   * > confirmedReceipt = await conflux.sendTransaction({from:account, to:address, value:0}).confirmed(); // await till risk coefficient < threshold (default 1e-8)
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
  async sendTransaction(options, password) {
    if (this.wallet.has(`${options.from}`)) {
      const transaction = await this._signTransaction(options);
      return this.sendRawTransaction(transaction.serialize());
    }

    return this.provider.call('cfx_sendTransaction',
      format.sendTx(options),
      password,
    );
  }

  // ------------------------------ contract ----------------------------------
  /**
   * Returns the code of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<string>} Byte code of contract, or 0x if the contract does not exist.
   *
   * @example
   * > await conflux.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
   */
  async getCode(address, epochNumber) {
    return this.provider.call('cfx_getCode',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns storage entries from a given contract.
   *
   * @param address {string} - Address to contract.
   * @param position {string} - The given position.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<string|null>} Storage entry of given query, or null if the it does not exist.
   *
   * @example
   * > await conflux.getStorageAt('0x866aca87ff33a0ae05d2164b3d999a804f583222', '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9')
   "0x000000000000000000000000000000000000000000000000000000000000162e"
   */
  async getStorageAt(address, position, epochNumber) {
    return this.provider.call('cfx_getStorageAt',
      format.address(address),
      format.hex64(position),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns the storage root of a given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<object>} A storage root object, or `null` if the contract does not exist
   * - delta `string`: storage root in the delta trie.
   * - intermediate `string`: storage root in the intermediate trie.
   * - snapshot `string`: storage root in the snapshot.
   *
   * @example
   * > await conflux.getStorageRoot('0x866aca87ff33a0ae05d2164b3d999a804f583222')
   {
      "delta": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "intermediate": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "snapshot": "0x7bb7d43152e56f529fbef709aab7371b0672f2332ae0fb4786da350f664df5b4"
   }
   */
  async getStorageRoot(address, epochNumber) {
    return this.provider.call('cfx_getStorageRoot',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns the sponsor info of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<object>} A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be 0:
   * - sponsorBalanceForCollateral `BigInt`: the sponsored balance for storage.
   * - sponsorBalanceForGas `BigInt`: the sponsored balance for gas.
   * - sponsorGasBound `BigInt`: the max gas could be sponsored for one transaction.
   * - sponsorForCollateral `string`: the address of the storage sponsor.
   * - sponsorForGas `string`: the address of the gas sponsor.
   *
   * @example
   * > await conflux.getSponsorInfo('0x866aca87ff33a0ae05d2164b3d999a804f583222')
   {
      "sponsorBalanceForCollateral": "0",
      "sponsorBalanceForGas": "0",
      "sponsorGasBound": "0",
      "sponsorForCollateral": "0x0000000000000000000000000000000000000000",
      "sponsorForGas": "0x0000000000000000000000000000000000000000"
   }
   */
  async getSponsorInfo(address, epochNumber) {
    const result = await this.provider.call('cfx_getSponsorInfo',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.sponsorInfo(result);
  }

  /**
   * Returns the size of the collateral storage of given address, in Byte.
   *
   * @param address {string} - Address to check for collateral storage.
   * @param [epochNumber='latest_state'] - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<BigInt>} - The collateral storage in Byte.
   *
   * @example
   * > await conflux.getCollateralForStorage('0xc94770007dda54cf92009bff0de90c06f603a09f')
   "158972490234375000"
   */
  async getCollateralForStorage(address, epochNumber) {
    const result = await this.provider.call('cfx_getCollateralForStorage',
      format.address(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUIntDec(result);
  }

  /**
   * Virtually call a contract, return the output data.
   *
   * @param options {object} - See [format.sendTx](#util/format.js/sendTx)
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<string>} The output data.
   */
  async call(options, epochNumber) {
    try {
      return await this.provider.call('cfx_call',
        format.callTx(options),
        format.epochNumber.$or(undefined)(epochNumber),
      );
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * Virtually call a contract, return the estimate gas used and storage collateralized.
   *
   * @param options {object} - See [format.estimateTx](#util/format.js/estimateTx)
   * @return {Promise<object>} A estimate result object:
   * - `BigInt` gasUsed: The gas used.
   * - `BigInt` storageCollateralized: The storage collateralized in Byte.
   */
  async estimateGasAndCollateral(options) {
    try {
      const result = await this.provider.call('cfx_estimateGasAndCollateral',
        format.estimateTx(options),
      );
      return format.estimate(result);
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * Returns logs matching the filter provided.
   *
   * @param [options] {object}
   * @param [options.fromEpoch='latest_checkpoint'] {string|number} - See [format.sendTx](#util/format.js/epochNumber). Search will be applied from this epoch number.
   * @param [options.toEpoch='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber). Search will be applied up until (and including) this epoch number.
   * @param [options.blockHashes] {string[]} -  Array of up to 128 block hashes that the search will be applied to. This will override from/to epoch fields if it's not null
   * @param [options.address] {string|string[]} - Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
   * @param [options.topics] {array} - Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.
   * @param [options.limit] {number} - Return the last limit logs
   * @return {Promise<object[]>} Array of log, that the logs matching the filter provided:
   * - address `string`: Address this event originated from.
   * - topics `string[]`: Array of topics.
   * - data `string`: The data containing non-indexed log parameter.
   * - blockHash `string`: Hash of the block where the log in.
   * - epochNumber `number`: Epoch number of the block where the log in.
   * - transactionHash `string`: Hash of the transaction where the log in.
   * - transactionIndex `string`: Transaction index in the block.
   * - logIndex `number`: Log index in block.
   * - transactionLogIndex `number`: Log index in transaction.
   *
   * @example
   * > await conflux.getLogs({
      address: '0x866aca87ff33a0ae05d2164b3d999a804f583222',
      fromEpoch: 0,
      toEpoch: 'latest_mined',
      limit: 1,
      topics: ['0x93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db153']
    });
   [
   {
        "address": "0x866aca87ff33a0ae05d2164b3d999a804f583222",
        "blockHash": "0x0ecbc75aca22cd1566a18c6a7a55f235ae12684c2749b40ac91262d6e8783b0b",
        "data": "0x",
        "epochNumber": 1504,
        "logIndex": 2,
        "topics": [
          "0x93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db153",
          "0x000000000000000000000000873c4bd4d847bcf7dc066bf4a7cd31dcf182258c",
          "0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b",
          "0x000000000000000000000000873c4bd4d847bcf7dc066bf4a7cd31dcf182258c"
        ],
        "transactionHash": "0x2a696f7be50c364333bc145f082e79da3a6e730318b7f7822e3e1fe22e42560b",
        "transactionIndex": 0,
        "transactionLogIndex": 2
      }
   ]
   */
  async getLogs(options) {
    if (options.blockHashes !== undefined && (options.fromEpoch !== undefined || options.toEpoch !== undefined)) {
      throw new Error('OverrideError, do not use `blockHashes` with `fromEpoch` or `toEpoch`, cause only `blockHashes` will take effect');
    }

    const result = await this.provider.call('cfx_getLogs', format.getLogs(options));

    return format.logs(result);
  }

  // TODO recall failed tx 0xbbf1a43d2d7d51a33c15f87af1582e2d762b669db8aef2bc657458087b0f805c

  // ----------------------------- subscription -------------------------------
  /**
   * Subscribe event by name and got id, and provider will emit event by id
   *
   * > Note: suggest use `conflux.subscribeXXX` to subscribe
   *
   * @param name {string} - Subscription name
   * @param args {array} - Subscription arguments
   * @return {Promise<string>} Id of subscription
   *
   * @example
   * > conflux = new Conflux({url:'ws://127.0.0.1:12535'})
   * > id = await conflux.subscribe('epochs');
   "0x8fe7879a1681e9b9"
   * > conflux.provider.on(id, data=>console.log(data));
   {
     epochHashesOrdered: [
       '0x0eff33578346b8e8347af3bae948eb7f4f5c27add9dbcfeb55eaf7cb3640088f',
       '0xb0cedac34a06ebcb42c3446a6bb2df1f0dcd9d83061f550460e387d19a4d8e91'
     ],
     epochNumber: '0x8cb32'
   }
   */
  async subscribe(name, ...args) {
    return this.provider.call('cfx_subscribe', name, ...args);
  }

  /**
   * The epochs topic streams consensus results: the total order of blocks, as expressed by a sequence of epochs.
   * The returned series of epoch numbers is monotonically increasing with an increment of one.
   * If you see the same epoch twice, this suggests a pivot chain reorg has happened (this might happen for recent epochs).
   * For each epoch, the last hash in epochHashesOrdered is the hash of the pivot block.
   *
   * @return {Promise<Subscription>} EventEmitter instance with the follow events:
   * - 'data':
   *   - epochNumber `number`: epoch number
   *   - epochHashesOrdered `array`: epoch block hash in order
   *     - `string`: block hash
   *
   * @example
   * > subscription = await conflux.subscribeEpochs()
   * > subscription.on('data', data=>console.log(data))
   {
     epochNumber: 566031,
     epochHashesOrdered: [
       '0x2820dbb5c4126455ad37bc88c635ae1f35e0d4f85c74300c01828f57ea1e5969',
       '0xd66b801335ba01e2448df52e59da584b54fc7ee7c2f8160943c097e1ebd23038'
     ]
    }
   {
     epochNumber: 566032,
     epochHashesOrdered: [
       '0x899606b462f0141d672aaea8497c82aebbd7b16d266fad71e9d5093b5c6d392e',
       '0xf6093d19c4df3645cd972e9f791fe0db3a1ab70881023a8aee63f64e0c3ca152'
     ]
   }
   */
  async subscribeEpochs() {
    const id = await this.subscribe('epochs');
    const subscription = new Subscription(id);

    this.provider.on(id, data => {
      subscription.emit('data', format.epoch(data));
    });

    return subscription;
  }

  /**
   * The newHeads topic streams all new block headers participating in the consensus.
   *
   * @return {Promise<Subscription>} EventEmitter instance with the follow events:
   * - 'data': see `getBlockByHash`
   *
   * @example
   * > subscription = await conflux.subscribeNewHeads()
   * > subscription.on('data', data=>console.log(data))
   {
     difficulty: '19874410',
     epochNumber: null,
     gasLimit: '30000000',
     height: 566239,
     powQuality: '39637224',
     timestamp: 1602644636,
     adaptive: false,
     blame: 0,
     deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
     deferredReceiptsRoot: '0x35182c1c5f1fbb0864758585d94cefcb794619ba8ef4a7adc2e3d48e85a2d4b0',
     deferredStateRoot: '0x2cf6ee27ed82e76c585ca46838746907512b86aab04f9f27cb04047939ec056f',
     hash: '0x9454515ccd8493d2121e60549efd321de96a7322a95e8d537f7b2d0504a03f21',
     miner: '0x10f9db11bb1509041909b35be6a3546fe65d22d0',
     nonce: '0x611a95000001fe98',
     parentHash: '0xf7edf9f6c11ebd4e9c1aa0a2c03203932c0ad79c3fd92cb7540bcf351aa90376',
     refereeHashes: [
       '0x4d69e1b945ec2c819bc20bcb0e128e4b161ed28355d42b6d05a6f7cac9ab91f9'
     ],
     transactionsRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    }
   */
  async subscribeNewHeads() {
    const id = await this.subscribe('newHeads');
    const subscription = new Subscription(id);

    this.provider.on(id, data => {
      subscription.emit('data', format.head(data));
    });

    return subscription;
  }

  /**
   * The logs topic streams all logs matching a certain filter, in order.
   * In case of a pivot chain reorg (which might affect recent logs), a special revert message is sent.
   * All logs received previously that belong to epochs larger than the one in this message should be considered invalid.
   *
   * @param [options] {object}
   * @param [options.address] {string|string[]} - Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
   * @param [options.topics] {array} - Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.
   * @return {Promise<Subscription>} EventEmitter instance with the follow events:
   * - 'data': see `getLogs`
   * - 'revert':
   *   - revertTo 'number': epoch number
   *
   * @example
   * > subscription = await conflux.subscribeLogs()
   * > subscription.on('data', data=>console.log(data))
   {
     epochNumber: 568224,
     logIndex: 0,
     transactionIndex: 0,
     transactionLogIndex: 0,
     address: '0x84ed30d7ddc5ff82ac271ae4e7add5a8b22a8d71',
     blockHash: '0xc02689eea6a507250838463c13e6b633479e2757dfb7e9b2593d5c31b54adb63',
     data: '0x0000000000000000000000000000000000000000000000000000000000000001',
     topics: [
       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
     ],
     transactionHash: '0x950ddec9ce3b42c4d8ca120722fa318ae64dc2e24553201f55f68c00bfd9cc4c'
   }
   * @example
   * > subscription.on('revert', data=>console.log(data))
   { revertTo: 568230 }
   { revertTo: 568231 }
   */
  async subscribeLogs({ address, topics } = {}) {
    const id = await this.subscribe('logs', format.getLogs({ address, topics }));

    const subscription = new Subscription(id);
    this.provider.on(id, data => {
      if (data.revertTo) {
        subscription.emit('revert', format.revert(data));
      } else {
        subscription.emit('data', format.log(data));
      }
    });

    return subscription;
  }

  /**
   * Unsubscribe subscription.
   *
   * @param id {string|Subscription} - Subscription id
   * @return {Promise<boolean>} Is success
   *
   * @example
   * > id = await conflux.subscribe('epochs');
   * > await conflux.unsubscribe(id);
   true
   * > await conflux.unsubscribe(id);
   false

   * @example
   * > subscription = await conflux.subscribeLogs();
   * > await conflux.unsubscribe(subscription);
   true
   */
  async unsubscribe(id) {
    return this.provider.call('cfx_unsubscribe', `${id}`);
  }
}

module.exports = Conflux;
