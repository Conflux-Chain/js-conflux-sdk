const Big = require('big.js');
const RPCMethodFactory = require('./index');
const format = require('../util/format');
const CONST = require('../CONST');
const { decodeCfxAddress, ADDRESS_TYPES } = require('../util/address');
const PendingTransaction = require('../subscribe/PendingTransaction');
const Contract = require('../contract');

class CFX extends RPCMethodFactory {
  constructor(conflux) {
    super(conflux.provider);
    this.conflux = conflux;
    this.provider = conflux.provider;
    this._formatAddress = conflux._formatAddress;
    // add RPC methods
    super.addMethods(this.methods());
    // decorate methods;
    this.sendRawTransaction = this._decoratePendingTransaction(this.sendRawTransaction);
    this.sendTransaction = this._decoratePendingTransaction(this.sendTransaction);
    this._addRequestBuilderToCustomMethods();
  }

  methods() {
    const formatAddressWithNetworkId = this._formatAddress.bind(this.conflux);
    return [
      {
        method: 'cfx_clientVersion',
      },
      {
        method: 'cfx_getSupplyInfo',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.supplyInfo,
      },
      {
        method: 'cfx_getStatus',
        responseFormatter: format.status,
      },
      {
        method: 'cfx_gasPrice',
        alias: 'getGasPrice',
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getInterestRate',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getAccumulateInterestRate',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getAccount',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.account,
      },
      {
        method: 'cfx_getBalance',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getStakingBalance',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getNextNonce',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getAdmin',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
      },
      {
        method: 'cfx_getVoteList',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.voteList,
      },
      {
        method: 'cfx_getDepositList',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.depositList,
      },
      {
        method: 'cfx_epochNumber',
        alias: 'getEpochNumber',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.uInt,
      },
      {
        method: 'cfx_getBlockByEpochNumber',
        requestFormatters: [
          format.epochNumber,
          format.boolean, // TODO default false
        ],
        responseFormatter: format.block.$or(null),
      },
      {
        method: 'cfx_getBlockByBlockNumber',
        requestFormatters: [
          format.bigUIntHex,
          format.boolean,
        ],
        responseFormatter: format.block.$or(null),
      },
      {
        method: 'cfx_getBlocksByEpoch',
        alias: 'getBlocksByEpochNumber',
        requestFormatters: [
          format.epochNumber,
        ],
      },
      {
        method: 'cfx_getBlockRewardInfo',
        requestFormatters: [
          format.epochNumber,
        ],
        responseFormatter: format.rewardInfo,
      },
      {
        method: 'cfx_getBestBlockHash',
      },
      {
        method: 'cfx_getBlockByHash',
        requestFormatters: [
          format.blockHash,
          format.boolean,
        ],
        responseFormatter: format.block.$or(null),
      },
      {
        method: 'cfx_getBlockByHashWithPivotAssumption',
        requestFormatters: [
          format.blockHash,
          format.blockHash,
          format.epochNumber,
        ],
        responseFormatter: format.block,
      },
      {
        method: 'cfx_getConfirmationRiskByHash',
        requestFormatters: [
          format.blockHash,
        ],
        responseFormatter: format.fixed64.$or(null),
      },
      {
        method: 'cfx_getTransactionByHash',
        requestFormatters: [
          format.transactionHash,
        ],
        responseFormatter: format.transaction.$or(null),
      },
      {
        method: 'cfx_getTransactionReceipt',
        requestFormatters: [
          format.transactionHash,
        ],
        responseFormatter: format.receipt.$or(null),
      },
      {
        method: 'cfx_sendRawTransaction',
        requestFormatters: [
          format.hex,
        ],
      },
      {
        method: 'cfx_getCode',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumber.$or(undefined),
        ],
        responseFormatter: format.any,
      },
      {
        method: 'cfx_getStorageAt',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.hex64,
          format.epochNumber.$or(undefined),
        ],
      },
      {
        method: 'cfx_getStorageRoot',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
      },
      {
        method: 'cfx_getSponsorInfo',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.sponsorInfo,
      },
      {
        method: 'cfx_getAccountPendingInfo',
        requestFormatters: [
          formatAddressWithNetworkId,
        ],
        responseFormatter: format.accountPendingInfo,
      },
      {
        method: 'cfx_getAccountPendingTransactions',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.bigUIntHex.$or(undefined),
          format.bigUIntHex.$or(undefined),
        ],
        responseFormatter: format.accountPendingTransactions,
      },
      {
        method: 'cfx_getCollateralForStorage',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_checkBalanceAgainstTransaction',
        requestFormatters: [
          formatAddressWithNetworkId,
          formatAddressWithNetworkId,
          format.bigUIntHex,
          format.bigUIntHex,
          format.bigUIntHex,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.any,
      },
      /* {
        method: 'cfx_call',
        requestFormatters: [
          this.conflux._formatCallTx,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.any, // TODO catch exception and decode error
      },
      {
        method: 'cfx_estimateGasAndCollateral',
        requestFormatters: [
          this.conflux._formatCallTx,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.estimate,
      }, */
      {
        method: 'cfx_getLogs',
        beforeHook(options) {
          if (options.blockHashes !== undefined && (options.fromEpoch !== undefined || options.toEpoch !== undefined)) {
            throw new Error('OverrideError, do not use `blockHashes` with `fromEpoch` or `toEpoch`, cause only `blockHashes` will take effect');
          }
        },
        requestFormatters: [
          this.conflux._formatGetLogs.bind(this.conflux),
        ],
        responseFormatter: format.logs,
      },
      {
        method: 'cfx_getEpochReceipts',
        requestFormatters: [
          format.epochNumber,
        ],
        responseFormatter: format.epochReceipts,
      },
      {
        method: 'cfx_getPoSEconomics',
        responseFormatter: format.posEconomics,
      },
    ];
  }

  _decoratePendingTransaction(func) {
    const cfx = this;
    return function (...args) {
      return new PendingTransaction(cfx, func.bind(this), args);
    };
  }

  _addRequestBuilderToCustomMethods() {
    const self = this;

    this.call.request = function (options, epochNumber) {
      return {
        request: {
          method: 'cfx_call',
          params: [
            self.conflux._formatCallTx(options),
            format.epochNumber.$or(undefined)(epochNumber),
          ],
        },
      };
    };

    this.estimateGasAndCollateral.request = function (options, epochNumber) {
      return {
        request: {
          method: 'cfx_estimateGasAndCollateral',
          params: [
            self.conflux._formatCallTx(options),
            format.epochNumber.$or(undefined)(epochNumber),
          ],
        },
        decoder: format.estimate,
      };
    };
  }

  /**
   * Auto populate transaction info (chainId, epochNumber, nonce, gas, gasPrice, storageLimit)
   *
   * @param {Object} options transaction info
   * @returns {Promise<Object>} Polulated complete transaction
   */
  async populateTransaction(options) {
    const {
      defaultGasPrice,
      defaultGasRatio,
      defaultStorageRatio,
    } = this.conflux;

    options.from = this._formatAddress(options.from);

    if (options.nonce === undefined) {
      options.nonce = await this.getNextNonce(options.from);
    }

    if (options.chainId === undefined) {
      options.chainId = this.conflux.networkId;
    }

    if (options.chainId === undefined) {
      const status = await this.getStatus();
      options.chainId = status.chainId;
    }

    if (options.epochHeight === undefined) {
      options.epochHeight = await this.epochNumber();
    }

    if (options.gasPrice === undefined) {
      if (defaultGasPrice === undefined) {
        const gasPrice = await this.gasPrice();
        options.gasPrice = Number(gasPrice) === 0 ? CONST.MIN_GAS_PRICE : gasPrice;
      } else {
        options.gasPrice = defaultGasPrice;
      }
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      let gas;
      let storageLimit;

      const isContract = decodeCfxAddress(options.from).type === ADDRESS_TYPES.CONTRACT;
      if (options.data || isContract) {
        const { gasUsed, storageCollateralized, gasLimit } = await this.estimateGasAndCollateral(options);
        if (defaultGasRatio) {
          gas = format.big(gasUsed).times(defaultGasRatio).toFixed(0);
        } else {
          gas = gasLimit;
        }
        storageLimit = format.big(storageCollateralized).times(defaultStorageRatio).toFixed(0);
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

    return options;
  }

  /**
   * Auto populate transaction and sign it with `from` 's privateKey in wallet
   *
   * @param {Object} options transaction info
   * @returns {Promise<string>} Hex encoded raw transaction
   */
  async populateAndSignTransaction(options) {
    await this.populateTransaction(options);
    const account = await this.conflux.wallet.get(`${options.from}`);
    const signedTx = await account.signTransaction(options);
    return signedTx.serialize();
  }

  /**
   * Auto populate transaction
   * if from's privateKey is in wallet, directly sign and encode it then send the rawTransaction with `cfx_sendRawTransaction` method
   * if not, sent the transaction with `cfx_sendTransaction` method
   *
   * @param {Object} options transaction info
   * @param {string} [password] Optional password to unlock account in fullnode
   * @return {Promise<hash>} Transaction hash
   */
  async sendTransaction(options, password) {
    if (this.conflux.wallet.has(`${options.from}`)) {
      const rawTx = await this.populateAndSignTransaction(options);
      return this.sendRawTransaction(rawTx);
    }

    return this.provider.call('cfx_sendTransaction',
      this.conflux._formatCallTx(options),
      password,
    );
  }

  /**
   * Get PoS interest rate
   *
   * @returns {Promise<string>} PoS interest rate
   */
  async getPoSInterestRate() {
    const RATIO = new Big(0.04);
    const batchRequest = this.conflux.BatchRequest();
    batchRequest.add(this.getSupplyInfo.request());
    batchRequest.add(this.getPoSEconomics.request());
    batchRequest.add(this.getBalance.request(CONST.ZERO_ADDRESS_HEX));
    const [
      { totalCirculating },
      { totalPosStakingTokens },
      balanceOfZeroAddress,
    ] = await batchRequest.execute();
    const bigTotalStaking = new Big(totalCirculating - balanceOfZeroAddress);
    const bigTotalPosStakingTokens = new Big(totalPosStakingTokens);
    const bigRatio = RATIO.div(bigTotalPosStakingTokens.div(bigTotalStaking).sqrt());
    return bigRatio.toString();
  }

  /**
   * Get epoch's receipt through pivot block's hash
   *
   * @param {hash} pivotBlockHash Hash of pivot block
   * @returns {Promise<Array>} All receipts of one epoch
   */
  async getEpochReceiptsByPivotBlockHash(pivotBlockHash) {
    const result = await this.provider.call('cfx_getEpochReceipts', `hash:${pivotBlockHash}`);
    return format.epochReceipts(result);
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
        this.conflux._formatCallTx(options),
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
        this.conflux._formatCallTx(options),
        format.epochNumber.$or(undefined)(epochNumber),
      );
      return format.estimate(result);
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * A advance method to check whether user's balance is enough to pay one transaction
   *
   * @param {Object} options Transaction info
   * @param {EpochNumber} [epochNumber] Optional epoch number
   * @returns {Promise<Object>} A object indicate whether user's balance is capable to pay the transaction.
   * - `BigInt` gasUsed: The gas used.
   * - `BigInt` gasLimit: The gas limit.
   * - `BigInt` storageCollateralized: The storage collateralized in Byte.
   * - `Boolean` isBalanceEnough: indicate balance is enough for gas and storage fee
   * - `Boolean` isBalanceEnoughForValueAndFee: indicate balance is enough for gas and storage fee plus value
   * - `Boolean` willPayCollateral: false if the transaction is eligible for storage collateral sponsorship, true otherwise
   * - `Boolean` willPayTxFee: false if the transaction is eligible for gas sponsorship, true otherwise
   */
  async estimateGasAndCollateralAdvance(options, epochNumber) {
    const estimateResult = await this.estimateGasAndCollateral(options, epochNumber);
    if (!options.from) {
      throw new Error('Can not check balance without `from`');
    }
    options = this.conflux._formatCallTx(options);
    const gasPrice = format.bigInt(options.gasPrice || BigInt(1));
    const txValue = format.bigInt(options.value || BigInt(0));
    const gasFee = gasPrice * estimateResult.gasLimit;
    const storageFee = estimateResult.storageCollateralized * (BigInt(1e18) / BigInt(1024));
    const balance = await this.getBalance(options.from);
    if (!options.to) {
      estimateResult.willPayCollateral = true;
      estimateResult.willPayTxFee = true;
      estimateResult.isBalanceEnough = balance > (gasFee + storageFee);
      estimateResult.isBalanceEnoughForValueAndFee = balance > (gasFee + storageFee + txValue);
    } else {
      const checkResult = await this.checkBalanceAgainstTransaction(
        options.from,
        options.to,
        estimateResult.gasLimit,
        gasPrice,
        estimateResult.storageCollateralized,
        epochNumber,
      );
      Object.assign(estimateResult, checkResult);
      let totalValue = txValue;
      totalValue += checkResult.willPayTxFee ? gasFee : BigInt(0);
      totalValue += checkResult.willPayCollateral ? storageFee : BigInt(0);
      estimateResult.isBalanceEnoughForValueAndFee = balance > totalValue;
    }
    return estimateResult;
  }
}

module.exports = CFX;
