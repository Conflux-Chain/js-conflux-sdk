const CONST = require('./CONST');
const { assert } = require('./util');
const format = require('./util/format');
const { decodeCfxAddress, ADDRESS_TYPES } = require('./util/address');
const providerFactory = require('./provider');
const Wallet = require('./wallet');
const Contract = require('./contract');
const internalContract = require('./contract/internal');
const { CRC20_ABI } = require('./contract/standard');
const PendingTransaction = require('./subscribe/PendingTransaction');
const Subscription = require('./subscribe/Subscription');
const pkg = require('../package.json');

/**
 * A sdk of conflux.
 */
class Conflux {
  /**
   * Create a Conflux instance with networdId set up
   */
  static async create(options) {
    const cfx = new Conflux(options);
    if (options.networkId) return cfx;
    await cfx.updateNetworkId();
    return cfx;
  }

  /**
   * @param [options] {object} - Conflux and Provider constructor options.
   * @param [options.defaultGasPrice] {string|number} - The default gas price in drip to use for transactions.
   * @param [options.defaultGasRatio=1.1] {number} - The ratio to multiply by gas.
   * @param [options.defaultStorageRatio=1.1] {number} - The ratio to multiply by storageLimit.
   * @param [options.url] {string} - Url of Conflux node to connect.
   * @param [options.retry] {number} - Retry times if request error occurs.
   * @param [options.timeout] {number} - Request time out in ms
   * @param [options.logger] {Object} - Logger object with 'info' and 'error' method.
   * @param [options.networkId] {number} - Connected RPC's networkId
   * @example
   * > const { Conflux } = require('js-conflux-sdk');
   * > const conflux = new Conflux({url:'https://test.confluxrpc.com', networkId: 1});
   *
   * @example
   * > const conflux = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
   */
  constructor({
    defaultGasPrice,
    defaultGasRatio = 1.1,
    defaultStorageRatio = 1.1,
    networkId,
    useHexAddressInParameter = false,
    ...rest
  } = {}) {
    this.version = pkg.version;

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

    /**
     * If transaction.gas is undefined, gas will be set by estimate,
     * cause gas used might be change during `estimateGasAndCollateral` and `sendTransaction`,
     * estimate value need to multiply by defaultGasRatio (>1.0) in case of gas not enough.
     *
     * > transaction.gas = estimate.gasUsed * defaultGasRatio
     *
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     *
     * @type {number}
     */
    this.defaultGasRatio = defaultGasRatio;

    /**
     * If transaction.storageLimit is undefined, storageLimit will be set by estimate,
     * cause storage limit might be change during `estimateGasAndCollateral` and `sendTransaction`,
     * estimate value need to multiply by defaultStorageRatio (>1.0) in case of storageLimit not enough.
     *
     * > transaction.storageLimit = estimate.storageCollateralized * defaultStorageRatio
     *
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     *
     * @type {number}
     */
    this.defaultStorageRatio = defaultStorageRatio;

    this.sendRawTransaction = this._decoratePendingTransaction(this.sendRawTransaction);
    this.sendTransaction = this._decoratePendingTransaction(this.sendTransaction);

    if (networkId) {
      this.networkId = networkId;
      this.wallet.setNetworkId(networkId);
    }

    this.useHexAddressInParameter = useHexAddressInParameter;
  }

  _decoratePendingTransaction(func) {
    const conflux = this;
    return function (...args) {
      return new PendingTransaction(conflux, func.bind(this), args);
    };
  }

  _formatAddress(address) {
    if (!this.networkId) {
      console.warn('Conflux address: networkId is not set properly, please set it');
    }
    return this.useHexAddressInParameter ? format.hexAddress(address) : format.address(address, this.networkId);
  }

  _formatCallTx(options) {
    return format.callTxAdvance(this.networkId, this.useHexAddressInParameter)(options);
  }

  _formatGetLogs(options) {
    return format.getLogsAdvance(this.networkId, this.useHexAddressInParameter)(options);
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
   * Create an token CRC20 contract with standard CRC20 abi
   *
   * @param address {string}
   * @returns  {Contract} - A token contract instance
   */
  CRC20(address) {
    return this.Contract({ address, abi: CRC20_ABI });
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
   * Update conflux networkId from RPC
   */
  async updateNetworkId() {
    const { networkId } = await this.getStatus();
    this.networkId = networkId;
    this.wallet.setNetworkId(this.networkId);
  }

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
   * Get supply info
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object>} Return supply info
   * - totalIssued `BigInt`: Total issued balance in `Drip`
   * - totalStaking `BigInt`: Total staking balance in `Drip`
   * - totalCollateral `BigInt`: Total collateral balance in `Drip`
   *
   * @example
   * > await conflux.getSupplyInfo()
   {
     totalCirculating: 28953062500000000000000n,
     totalCollateral: 28953062500000000000000n,
     totalIssued: 5033319899279074765657343554n,
     totalStaking: 25026010834970490328077641n
   }
   */
  async getSupplyInfo(epochNumber) {
    const result = await this.provider.call('cfx_getSupplyInfo',
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.supplyInfo(result);
  }

  /**
   * Get status
   * @return {Promise<object>} Status information object
   * - chainId `number`: Chain id
   * - epochNumber `number`: Epoch number
   * - blockNumber `number`: Block number
   * - pendingTxNumber `number`: Pending transaction number
   * - bestHash `string`: The block hash of best pivot block
   *
   * @example
   * > await conflux.getStatus()
   {
      chainId: 1029,
      networkId: 1029,
      epochNumber: 1117476,
      blockNumber: 2230973,
      pendingTxNumber: 4531,
      bestHash: '0x8d581f13fa0548f2751450a7dabd871777875c9ccdf0d8bd629e07a7a5a7917a'
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
   1n
   */
  async getGasPrice() {
    const result = await this.provider.call('cfx_gasPrice');
    return format.bigUInt(result);
  }

  /**
   * Returns the interest rate of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} The interest rate of given parameter.
   *
   * @example
   * > await conflux.getInterestRate();
   2522880000000n
   */
  async getInterestRate(epochNumber) {
    const result = await this.provider.call('cfx_getInterestRate',
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the accumulate interest rate of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} The accumulate interest rate of given parameter.
   *
   * @example
   * > await conflux.getAccumulateInterestRate()
   76357297457647044505744908994993n
   */
  async getAccumulateInterestRate(epochNumber) {
    const result = await this.provider.call('cfx_getAccumulateInterestRate',
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  // ------------------------------- address ----------------------------------
  /**
   * Return account related states of the given account
   *
   * @param address {string} - address to get account.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object>} Return the states of the given account:
   * - balance `BigInt`: the balance of the account.
   * - nonce `BigInt`: the nonce of the account's next transaction.
   * - codeHash `string`: the code hash of the account.
   * - stakingBalance `BigInt`: the staking balance of the account.
   * - collateralForStorage `BigInt`: the collateral storage of the account.
   * - accumulatedInterestReturn `BigInt`: accumulated unterest return of the account.
   * - admin `string`: admin of the account.
   *
   * @example
   > await conflux.getAccount('cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4');
   {
      accumulatedInterestReturn: 0n,
      balance: 824812401057514588670n,
      collateralForStorage: 174187500000000000000n,
      nonce: 1449n,
      stakingBalance: 0n,
      admin: 'CFXTEST:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6F0VRCSW',
      codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
   }
   */
  async getAccount(address, epochNumber) {
    const result = await this.provider.call('cfx_getAccount',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.account(result);
  }

  /**
   * Returns the balance of the account of given address.
   *
   * @param address {string} - The address to get the balance of.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} The balance in Drip.
   *
   * @example
   * > await conflux.getBalance("cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4");
   824812401057514588670n
   */
  async getBalance(address, epochNumber) {
    const result = await this.provider.call('cfx_getBalance',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the balance of the staking account of given address.
   *
   * @param address {string} - Address to check for staking balance.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} The staking balance in Drip.
   *
   * @example
   * > await conflux.getStakingBalance('cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4', 'latest_state');
   0n
   */
  async getStakingBalance(address, epochNumber) {
    const result = await this.provider.call('cfx_getStakingBalance',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the next nonce should be used by given address.
   *
   * @param address {string} - The address to get the numbers of transactions from.
   * @param [epochNumber] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} The next nonce should be used by given address.
   *
   * @example
   * > await conflux.getNextNonce("cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4");
   1449n
   */
  async getNextNonce(address, epochNumber) {
    const result = await this.provider.call('cfx_getNextNonce',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the admin of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<string>} Address to admin, or `null` if the contract does not exist.
   *
   * @example
   * > conflux.getAdmin('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   "CFXTEST:TYPE.USER:AASB661U2R60UZN5H0C4H63HJ76WTGF552R9GHU7A4"
   */
  async getAdmin(address, epochNumber) {
    return this.provider.call('cfx_getAdmin',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns vote list of the given account.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object[]>} Vote list
   * - `array`:
   *   - amount `BigInt`: This is the number of tokens should be locked before
   *   - unlockBlockNumber `number`: This is the timestamp when the vote right will be invalid, measured in, the number of past blocks.
   */
  async getVoteList(address, epochNumber) {
    const result = await this.provider.call('cfx_getVoteList',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.voteList(result);
  }

  /**
   * Returns deposit list of the given account.
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object[]>} Deposit list
   * - `array`:
   *   - amount `BigInt`: the number of tokens deposited
   *   - accumulatedInterestRate: `BigInt`: the accumulated interest rate at the time of the deposit
   *   - depositTime `number`: the time of the deposit
   */
  async getDepositList(address, epochNumber) {
    const result = await this.provider.call('cfx_getDepositList',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.depositList(result);
  }

  // -------------------------------- epoch -----------------------------------
  /**
   * Returns the epoch number of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
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
   * @param epochNumber {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
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
   * Returns information about a block by block number.
   *
   * @param blockNumber {string|number}
   * @param [detail=false] {boolean} - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
   * @return {Promise<object|null>} See `getBlockByHash`
   *
   * @example
   * > await conflux.getBlockByBlockNumber('0x123', true);
   {...}
   */
  async getBlockByBlockNumber(blockNumber, detail = false) {
    const result = await this.provider.call('cfx_getBlockByBlockNumber',
      format.bigUIntHex(blockNumber),
      format.boolean(detail),
    );
    return format.block.$or(null)(result);
  }

  /**
   * Returns hashes of blocks located in some epoch.
   *
   * @param epochNumber {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
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
   * @param epochNumber {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object[]>} List of block reward info
   * - blockHash `string`: Hash of the block.
   * - author `string`: The address of the beneficiary to whom the mining rewards were given.
   * - baseReward `BigInt`: Block base reward in `Drip`
   * - totalReward `BigInt`: Block total reward in `Drip`
   * - txFee `BigInt`: Total gas fee of block transaction
   *
   * @example
   * > await conflux.getBlockRewardInfo(6);
   [
   {
      baseReward: 6993700000000000000n,
      totalReward: 6993700031741486703n,
      txFee: 0n,
      author: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6',
      blockHash: '0x73cd891aea310e2c0b8644de91746c7353cebfffb780126bc06101b20689c893'
    },
   {
      baseReward: 6997200000000000000n,
      totalReward: 6997200031760371742n,
      txFee: 3000000n,
      author: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6',
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390'
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
   * > await conflux.getBlockByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390');
   {
      epochNumber: 6,
      blame: 0,
      height: 6,
      size: 352,
      timestamp: 1603901780,
      gasLimit: 30000000n,
      gasUsed: 61118n,
      difficulty: 20000000000n,
      transactions: [
        '0xaad69c8c814aec3e418b68f60917c607920a531e7082dd2c642323b43ecadb94',
        '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce'
      ],
      adaptive: false,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508',
      deferredStateRoot: '0x50c0fcbc5bafa7d1dba7b19c87629830106a6be8d0adf505cdc656bb43535d69',
      hash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      miner: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6',
      nonce: '0x17d86f2f6',
      parentHash: '0xc8a412b4b77b48d61f694975f032d109f26bb0f9fc02e4b221d67a382fab386b',
      powQuality: '0x5a0f86a6f4',
      refereeHashes: [
        '0x73cd891aea310e2c0b8644de91746c7353cebfffb780126bc06101b20689c893'
      ],
      transactionsRoot: '0xd2f08676484ba2a3738194f44542eb29fb290b8ed74bf007f132fe51d89b2e7c'
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
   * > await conflux.getConfirmationRiskByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390')
   1e-8
   */
  async getConfirmationRiskByHash(blockHash) {
    const result = await this.provider.call('cfx_getConfirmationRiskByHash',
      format.blockHash(blockHash),
    );
    return format.fixed64.$or(null)(result);
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
   * - epochHeight `number`: epoch height
   * - from `string`: address of the sender.
   * - gas `BigInt`: gas provided by the sender.
   * - gasPrice `number`: gas price provided by the sender in Drip.
   * - hash `string`: hash of the transaction.
   * - nonce `BigInt`: the number of transactions made by the sender prior to this one.
   * - r `string`: ECDSA signature r
   * - s `string`: ECDSA signature s
   * - status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
   * - storageLimit `BigInt`: storage limit in bytes
   * - chainId `number`: chain id
   * - to `string`: address of the receiver. null when its a contract creation transaction.
   * - transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
   * - v `string`: ECDSA recovery id
   * - value `BigInt`: value transferred in Drip.
   *
   * @example
   * > await conflux.getTransactionByHash('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      nonce: 0n,
      gasPrice: 10n,
      gas: 200000n,
      value: 0n,
      storageLimit: 1024n,
      epochHeight: 0,
      chainId: 1029,
      v: 1,
      status: 0,
      transactionIndex: 1,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      data: '0xfebe49090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000162788589c8e386863f217faef78840919fb2854',
      from: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6',
      hash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      r: '0x495da01ae9f445847022a8bc7df0198577ba75f88b26699f61afb435bb9c50bc',
      s: '0x2291051b1c53db1d6bfe2fb29be1bf512d063e726dc6b98aaf0f2259b7456be0',
      to: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6'
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
   * - gasCoveredBySponsor `boolean`: `true` if this transaction's gas fee was covered by the sponsor.
   * - storageCoveredBySponsor `boolean`: `true` if this transaction's storage collateral was covered by the sponsor.
   * - storageCollateralized `BigInt`: the amount of storage collateral this transaction required.
   * - storageReleased `array`: array of storage change objects, each specifying an address and the corresponding amount of storage collateral released
   *   - address `string`: address released
   *   - collaterals `BigInt`: corresponding amount of storage collateral released
   *
   * @example
   * > await conflux.getTransactionReceipt('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      index: 1,
      epochNumber: 6,
      outcomeStatus: 0,
      gasUsed: 30559n,
      gasFee: 1500000n,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      from: 'CFXTEST:TYPE.USER:AAJJ1C2XGRKDY8RPG2828UPAN4A5BBSZNYB28K0PHS',
      logs: [],
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      stateRoot: '0xd6a7c2c14cb0d1233010acca98e114db5a10e0b94803d23b01a6777b7fd3b2fd',
      to: 'CFXTEST:TYPE.CONTRACT:ACB59FK6VRYH8DJ5VYVEHJ9APZHPD72RDP2FVP77R9',
      transactionHash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      txExecErrorMsg: null,
      gasCoveredBySponsor: false,
      storageCoveredBySponsor: false,
      storageCollateralized: 0n,
      storageReleased: [
        address: '0x0000000000000000000000000000000000000001',
        collaterals: 640n,
      ],
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
    const result = await this.provider.call('cfx_sendRawTransaction',
      format.hex(hex),
    );
    return result;
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
        const gasPrice = await this.getGasPrice();
        options.gasPrice = Number(gasPrice) === 0 ? CONST.MIN_GAS_PRICE : gasPrice;
      } else {
        options.gasPrice = this.defaultGasPrice;
      }
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      let gas;
      let storageLimit;

      const isContract = decodeCfxAddress(account.address).type === ADDRESS_TYPES.CONTRACT;
      if (options.data || isContract) {
        const { gasUsed, storageCollateralized } = await this.estimateGasAndCollateral(options);
        gas = format.big(gasUsed).times(this.defaultGasRatio).toFixed(0);
        storageLimit = format.big(storageCollateralized).times(this.defaultStorageRatio).toFixed(0);
      } else {
        gas = CONST.TRANSACTION_GAS;
        storageLimit = CONST.TRANSACTION_STORAGE_LIMIT;
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
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param [password] {string} - Password for remote node.
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   *
   * @example
   * > txHash = await conflux.sendTransaction({from:account, to:address, value:0}); // send and get transaction hash
   "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"

   * @example
   * > packedTx = await conflux.sendTransaction({from:account, to:address, value:0}).get(); // await till transaction packed
   {
    "nonce": 8n,
    "value": 0n,
    "gasPrice": 1000000000n,
    "gas": 21000n,
    "v": 0,
    "transactionIndex": null,
    "status": null,
    "storageLimit": 0n,
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": null,
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76"
   }

   * @example
   * > minedTx = await conflux.sendTransaction({from:account, to:address, value:0}).mined(); // await till transaction mined
   {
    "nonce": 8n,
    "value": 0n,
    "gasPrice": 1000000000n,
    "gas": 21000n,
    "v": 0,
    "transactionIndex": 0,
    "status": 0,
    "storageLimit": 0n,
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76"
   }

   * @example
   * > executedReceipt = await conflux.sendTransaction({from:account, to:address, value:0}).executed(); // await till transaction executed
   {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": 21000n,
    "gasFee": 21000000000000n,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
   }

   * @example
   * > confirmedReceipt = await conflux.sendTransaction({from:account, to:address, value:0}).confirmed(); // await till risk coefficient < threshold (default 1e-8)
   {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": 21000n,
    "gasFee": 21000000000000n,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
   }
   */
  async sendTransaction(options, password) {
    if (this.wallet.has(`${options.from}`)) {
      const transaction = await this._signTransaction(options);
      return this.sendRawTransaction(transaction.serialize());
    }

    return this.provider.call('cfx_sendTransaction',
      this._formatCallTx(options),
      password,
    );
  }

  // ------------------------------ contract ----------------------------------
  /**
   * Returns the code of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<string>} Byte code of contract, or 0x if the contract does not exist.
   *
   * @example
   * > await conflux.getCode('cfxtest:acb2nsctbanb9ezbw0mx1gapve60thyurjmxkage0f');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
   */
  async getCode(address, epochNumber) {
    return this.provider.call('cfx_getCode',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns storage entries from a given contract.
   *
   * @param address {string} - Address to contract.
   * @param position {string} - The given position.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<string|null>} Storage entry of given query, or null if the it does not exist.
   *
   * @example
   * > await conflux.getStorageAt('cfxtest:acdgzwyh9634bnuf4jne0tp3xmae80bwej1w4hr66c', '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9')
   "0x000000000000000000000000000000000000000000000000000000000000162e"
   */
  async getStorageAt(address, position, epochNumber) {
    return this.provider.call('cfx_getStorageAt',
      this._formatAddress(address),
      format.hex64(position),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns the storage root of a given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object>} A storage root object, or `null` if the contract does not exist
   * - delta `string`: storage root in the delta trie.
   * - intermediate `string`: storage root in the intermediate trie.
   * - snapshot `string`: storage root in the snapshot.
   *
   * @example
   * > await conflux.getStorageRoot('cfxtest:acdgzwyh9634bnuf4jne0tp3xmae80bwej1w4hr66c')
   {
      "delta": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "intermediate": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "snapshot": "0x7bb7d43152e56f529fbef709aab7371b0672f2332ae0fb4786da350f664df5b4"
   }
   */
  async getStorageRoot(address, epochNumber) {
    return this.provider.call('cfx_getStorageRoot',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
  }

  /**
   * Returns the sponsor info of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object>} A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be 0:
   * - sponsorBalanceForCollateral `BigInt`: the sponsored balance for storage.
   * - sponsorBalanceForGas `BigInt`: the sponsored balance for gas.
   * - sponsorGasBound `BigInt`: the max gas could be sponsored for one transaction.
   * - sponsorForCollateral `string`: the address of the storage sponsor.
   * - sponsorForGas `string`: the address of the gas sponsor.
   *
   * @example
   * > await conflux.getSponsorInfo('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   {
      sponsorBalanceForCollateral: 410625000000000000000n,
      sponsorBalanceForGas: 9999999993626232440n,
      sponsorGasBound: 10000000000n,
      sponsorForCollateral: 'CFXTEST:TYPE.CONTRACT:ACGZZ08M8Z2YWKEDA0JZU52FGAZ9U95Y1YV785YANX',
      sponsorForGas: 'CFXTEST:TYPE.CONTRACT:ACGZZ08M8Z2YWKEDA0JZU52FGAZ9U95Y1YV785YANX'
   }
   */
  async getSponsorInfo(address, epochNumber) {
    const result = await this.provider.call('cfx_getSponsorInfo',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.sponsorInfo(result);
  }

  /**
   * Return pending info of an account
   *
   * @param address {string} - Address to account
   * @returns {Promise<object>} An account pending info object.
   * - localNonce `BigInt`: then next nonce can use in the transaction pool
   * - nextPendingTx `string`: the hash of next pending transaction
   * - pendingCount `BigInt`: the count of pending transactions
   * - pendingNonce `BigInt`: the nonce of pending transaction
   *
   */
  async getAccountPendingInfo(address) {
    const result = await this.provider.call('cfx_getAccountPendingInfo',
      this._formatAddress(address),
    );
    return format.accountPendingInfo(result);
  }

  /**
   * Return pending transactions of one account
   *
   * @param address {string} - base32 address
   * @returns {Promise<object>} An account's pending transactions and info.
   * - pendingTransactions `Array`: pending transactions
   * - firstTxStatus `Object`: the status of first pending tx
   * - pendingCount `BigInt`: the count of pending transactions
   */
  async getAccountPendingTransactions(address, startNonce, limit) {
    const result = await this.provider.call(
      'cfx_getAccountPendingTransactions',
      this._formatAddress(address),
      format.bigUIntHex.$or(undefined)(startNonce),
      format.bigUIntHex.$or(undefined)(limit),
    );
    return format.accountPendingTransactions(result);
  }

  /**
   * Returns the size of the collateral storage of given address, in Byte.
   *
   * @param address {string} - Address to check for collateral storage.
   * @param [epochNumber='latest_state'] - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} - The collateral storage in Byte.
   *
   * @example
   * > await conflux.getCollateralForStorage('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   89375000000000000000n
   */
  async getCollateralForStorage(address, epochNumber) {
    const result = await this.provider.call('cfx_getCollateralForStorage',
      this._formatAddress(address),
      format.epochNumber.$or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Virtually call a contract, return the output data.
   *
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<string>} The output data.
   */
  async call(options, epochNumber) {
    try {
      return await this.provider.call('cfx_call',
        this._formatCallTx(options),
        format.epochNumber.$or(undefined)(epochNumber),
      );
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * Virtually call a contract, return the estimate gas used and storage collateralized.
   *
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param [epochNumber='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object>} A estimate result object:
   * - `BigInt` gasUsed: The gas used.
   * - `BigInt` gasLimit: The gas limit.
   * - `BigInt` storageCollateralized: The storage collateralized in Byte.
   */
  async estimateGasAndCollateral(options, epochNumber) {
    try {
      const result = await this.provider.call('cfx_estimateGasAndCollateral',
        this._formatCallTx(options),
        format.epochNumber.$or(undefined)(epochNumber),
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
   * @param [options.fromEpoch='latest_checkpoint'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber). Search will be applied from this epoch number.
   * @param [options.toEpoch='latest_state'] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber). Search will be applied up until (and including) this epoch number.
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
      address: 'cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw',
      fromEpoch: 39802,
      toEpoch: 39802,
      limit: 1,
      topics: ['0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'],
    });
   [
   {
      epochNumber: 39802,
      logIndex: 2,
      transactionIndex: 0,
      transactionLogIndex: 2,
      address: 'CFXTEST:TYPE.CONTRACT:ACHC8NXJ7R451C223M18W2DWJNMHKD6RXA2GC31EUW',
      blockHash: '0xca00158a2a508170278d5bdc5ca258b6698306dd8c30fdba32266222c79e57e6',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde'
      ],
      transactionHash: '0xeb75f47002720311f1709e36d7f7e9a91ee4aaa469a1de892839cb1ef66a9939'
    }
   ]
   */
  async getLogs(options) {
    if (options.blockHashes !== undefined && (options.fromEpoch !== undefined || options.toEpoch !== undefined)) {
      throw new Error('OverrideError, do not use `blockHashes` with `fromEpoch` or `toEpoch`, cause only `blockHashes` will take effect');
    }

    const result = await this.provider.call('cfx_getLogs', this._formatGetLogs(options));

    return format.logs(result);
  }

  /**
   * Return block's execution trace.
   *
   * > Note: need RPC server open trace_block method
   *
   * @param blockHash {string} block hash
   * @return {Promise<object[]>} Array of transaction traces.
   *
   * @example
   * > await conflux.traceBlock('0xaf0e1d773dee28c95bcfa5480ed663fcc695b32c8c1dd81f57ff61ff09f55f88')
   {
        "transactionTraces": [
            {
                "traces": [
                    {
                        "action": {
                            "callType": "call",
                            "from": "CFXTEST:TYPE.USER:AAP6SU0S2UZ36X19HSCP55SR6N42YR1YK6HX8D8SD1",
                            "gas": "311592",
                            "input": "0x",
                            "to": "CFXTEST:TYPE.CONTRACT:ACCKUCYY5FHZKNBXMEEXWTAJ3BXMEG25B2NUF6KM25",
                            "value": "0"
                        },
                        "type": "call"
                    }
                ]
            },
            {
                "traces": [
                    {
                        "action": {
                            "from": "CFXTEST:TYPE.USER:AAR75DU3V36MG4U2DHAG44B40H6K4M2ARY46G0ECMB",
                            "gas": "83962",
                            "init": "0x",
                            "value": "0"
                        },
                        "type": "create"
                    }
                ]
            }
        ]
    }
   *
   */
  async traceBlock(blockHash) {
    const result = await this.provider.call('trace_block', format.blockHash(blockHash));
    return format.blockTraces(result);
  }

  /**
   * Return transaction's trace
   * @param txHash {string} transaction hash
   * @returns {Promise<object[]>} Array of traces.
   *
   * @example
   * > await conflux.traceTransaction('0xaf0e1d773dee28c95bcfa5480ed663fcc695b32c8c1dd81f57ff61ff09f55f88')
   */
  async traceTransaction(txHash) {
    const result = await this.provider.call('trace_transaction', format.transactionHash(txHash));
    return format.traces(result);
  }

  /**
   * Return traces that satisfy an filter
   * @param options {object} trace filters
   * @returns {Promise<object[]>} Array of traces.
   *
   * @example
   * > await conflux.traceFilter({
      fromEpoch: 1,
      toEpoch: 100,
      count: 100,
      after: 100,
      blockHashes: ['0xaf0e1d773dee28c95bcfa5480ed663fcc695b32c8c1dd81f57ff61ff09f55f88'],
      actionTypes: ['call_result']
    })
   */
  async traceFilter(options) {
    const result = await this.provider.call('trace_filter', format.traceFilter(options));
    return format.traces(result);
  }

  /**
   * Return one epoch's all receipts
   * @param epochNumber {number|string} epoch number
   * @returns {Promise<object[][]>} Array of array receipts.
   *
   * @example
   * > await conflux.getEpochReceipts('0x6')
   */
  async getEpochReceipts(epochNumber) {
    const result = await this.provider.call('cfx_getEpochReceipts', format.epochNumber(epochNumber));
    return format.epochReceipts(result);
  }

  /**
   * Return one epoch's all receipts by pivot block hash
   * @param pivotBlockHash {string} epoch pivot block hash
   * @returns {Promise<object[][]>} Array of array receipts.
   *
   * @example
   * > await conflux.getEpochReceiptsByPivotBlockHash('0x12291776d632d966896b6c580f3201cd2e2a3fd672378fc7965aa7f7058282b2')
   */
  async getEpochReceiptsByPivotBlockHash(pivotBlockHash) {
    const result = await this.provider.call('cfx_getEpochReceipts', `hash:${pivotBlockHash}`);
    return format.epochReceipts(result);
  }

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
   * @param [sub_epoch] {string} Available values are latest_mined(default value) and latest_state
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
  async subscribeEpochs(sub_epoch = CONST.EPOCH_NUMBER.LATEST_MINED) {
    const id = await this.subscribe('epochs', sub_epoch);
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
      difficulty: 368178587115n,
      epochNumber: null,
      gasLimit: 30000000n,
      height: 1118247,
      timestamp: 1605005752,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x7ae0d5716513206755b6f7c95272b79dbc225759b6e17727e19c2f15c3166bda',
      deferredStateRoot: '0x3cf5deba77c8aa9072f1e972d6a97db487a0ce88455f371eb8ac8fa77321cb9d',
      hash: '0x194675173abbc5aab50326136008774eea1a289e6722c973dfed12b703ee5f2a',
      miner: 'CFXTEST:TYPE.USER:AAPKCJR28DG976FZR43C5HF1RWN5XV8T1U8V8JW8A4',
      nonce: '0x799d35f695950fd6',
      parentHash: '0x4af3cf8cb358e75acad282ffa4b578b6211ea9eeb7cf87c282f120d8a1c809df',
      powQuality: '0xe7ac17feab',
      refereeHashes: [],
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
     address: 'CFXTEST:TYPE.CONTRACT:ACCS4PG151C99AZPE6RSK37R40YNEMYRSE9P475E82',
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
    const id = await this.subscribe('logs', this._formatGetLogs({ address, topics }));

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
