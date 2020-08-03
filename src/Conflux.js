const { assert, format, decorate } = require('./util');
const providerFactory = require('./provider');
const accountFactory = require('./account');
const Contract = require('./contract');
const decodeError = require('./contract/decodeError');
const { PendingTransaction } = require('./subscribe');
const internalContract = require('./contract/internal');

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
    this.provider = providerFactory(rest);

    /**
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     *
     * @deprecated
     * @type {number|string}
     */
    this.defaultGasPrice = defaultGasPrice;

    this.sendTransaction = decorate(this.sendTransaction, (func, ...args) => {
      return new PendingTransaction(func, args, this);
    });

    this.sendRawTransaction = decorate(this.sendRawTransaction, (func, ...args) => {
      return new PendingTransaction(func, args, this);
    });
  }

  /**
   * A shout cut for `accountFactory(options, conflux);`
   *
   * @param options {object} - See [accountFactory](#account/index.js/accountFactory)
   * @return {BaseAccount} A BaseAccount subclass instance
   *
   * @example
   * > account = conflux.Account({privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'})
   */
  Account(options) {
    return accountFactory(options, this);
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
   * @param name {string} Internal contract name
   * @return {Contract}
   *
   * @example
   * > conflux.InternalContract('AdminControl')
   {
    constructor: [Function: bound call],
    abi: ContractABICoder { * },
    address: '0x0888000000000000000000000000000000000000',
    destroy: [Function: bound call],
    set_admin: [Function: bound call],
    'destroy(address)': [Function: bound call],
    '0x00f55d9d': [Function: bound call],
    'set_admin(address,address)': [Function: bound call],
    '0x73e80cba': [Function: bound call]
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
    this.provider = providerFactory();
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
   * @return {Promise<JSBI>} Gas price in drip.
   *
   * @example
   * > await conflux.getGasPrice();
   "0"
   */
  async getGasPrice() {
    const result = await this.provider.call('cfx_gasPrice');
    return format.bigUInt(result);
  }

  /**
   * Returns the interest rate of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<JSBI>} The interest rate of given parameter.
   *
   * @example
   * > await conflux.getInterestRate();
   "2522880000000"
   */
  async getInterestRate(epochNumber) {
    const result = await this.provider.call('cfx_getInterestRate',
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the accumulate interest rate of given parameter.
   *
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<JSBI>} The accumulate interest rate of given parameter.
   *
   * @example
   * > await conflux.getAccumulateInterestRate()
   "76269979767787603657181926319926"
   */
  async getAccumulateInterestRate(epochNumber) {
    const result = await this.provider.call('cfx_getAccumulateInterestRate',
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  // ------------------------------- address ----------------------------------
  /**
   * Return account related states of the given account
   *
   * @param address {string} - address to get account.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<object>} Return the states of the given account:
   * balance `JSBI`: the balance of the account.
   * nonce `JSBI`: the nonce of the account's next transaction.
   * codeHash `string`: the code hash of the account.
   * stakingBalance `JSBI`: the staking balance of the account.
   * collateralForStorage `JSBI`: the collateral storage of the account.
   * accumulatedInterestReturn `JSBI`: accumulated unterest return of the account.
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
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.account(result);
  }

  /**
   * Returns the balance of the account of given address.
   *
   * @param address {string} - The address to get the balance of.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<JSBI>} The balance in Drip.
   *
   * @example
   * > await conflux.getBalance("0x1000000000000000000000000000000000000060");
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
   * Returns the balance of the staking account of given address.
   *
   * @param address {string} - Address to check for staking balance.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<JSBI>} The staking balance in Drip.
   *
   * @example
   * > await conflux.getStakingBalance('0xc94770007dda54cF92009BFF0dE90c06F603a09f', 'latest_state');
   "158972490234375000"
   */
  async getStakingBalance(address, epochNumber) {
    const result = await this.provider.call('cfx_getStakingBalance',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the next nonce should be used by given address.
   *
   * @param address {string} - The address to get the numbers of transactions from.
   * @param [epochNumber] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<JSBI>} The next nonce should be used by given address.
   *
   * @example
   * > await conflux.getNextNonce("0x1be45681ac6c53d5a40475f7526bac1fe7590fb8");
   "3"
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
      format.epochNumber.or(undefined)(epochNumber),
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
      format.epochNumber.or(undefined)(epochNumber),
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
    return format.block.or(null)(result);
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
   * - gasLimit `JSBI`: The maximum gas allowed in this block.
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
    return format.block.or(null)(result);
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
    return format.riskNumber(result);
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
   * - gas `JSBI`: gas provided by the sender.
   * - gasPrice `number`: gas price provided by the sender in Drip.
   * - hash `string`: hash of the transaction.
   * - nonce `JSBI`: the number of transactions made by the sender prior to this one.
   * - r `string`: ECDSA signature r
   * - s `string`: ECDSA signature s
   * - status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
   * - storageLimit `JSBI`: TODO
   * - chainId `number`: TODO
   * - to `string`: address of the receiver. null when its a contract creation transaction.
   * - transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
   * - v `string`: ECDSA recovery id
   * - value `JSBI`: value transferred in Drip.
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
    return format.transaction.or(null)(result);
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
    return format.receipt.or(null)(result);
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
   * Send transaction and sign by remote by password
   *
   * @private
   * @param options {object} - See [format.sendTx](#util/format.js/sendTx)
   * @param password {string} - Password for remote node.
   * @return {Promise<PendingTransaction>} The PendingTransaction object.
   */
  async sendTransaction(options, password) {
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
      format.epochNumber.or(undefined)(epochNumber),
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
      format.epochNumber.or(undefined)(epochNumber),
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
      format.epochNumber.or(undefined)(epochNumber),
    );
  }

  /**
   * Returns the sponsor info of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [epochNumber='latest_state'] {string|number} - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<object>} A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be 0:
   * - sponsorBalanceForCollateral `JSBI`: the sponsored balance for storage.
   * - sponsorBalanceForGas `JSBI`: the sponsored balance for gas.
   * - sponsorGasBound `JSBI`: the max gas could be sponsored for one transaction.
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
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.sponsorInfo(result);
  }

  /**
   * Returns the size of the collateral storage of given address, in Byte.
   *
   * @param address {string} - Address to check for collateral storage.
   * @param [epochNumber='latest_state'] - See [format.sendTx](#util/format.js/epochNumber)
   * @return {Promise<JSBI>} - The collateral storage in Byte.
   *
   * @example
   * > await conflux.getCollateralForStorage('0xc94770007dda54cf92009bff0de90c06f603a09f')
   "158972490234375000"
   */
  async getCollateralForStorage(address, epochNumber) {
    const result = await this.provider.call('cfx_getCollateralForStorage',
      format.address(address),
      format.epochNumber.or(undefined)(epochNumber),
    );
    return format.bigUInt(result);
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
        format.epochNumber.or(undefined)(epochNumber),
      );
    } catch (e) {
      throw decodeError(e);
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
      throw decodeError(e);
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
}

module.exports = Conflux;
