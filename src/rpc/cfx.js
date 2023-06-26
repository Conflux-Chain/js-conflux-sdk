const RPCMethodFactory = require('./index');
const format = require('../util/format');
const cfxFormat = require('./types/formatter');
const addressUtil = require('../util/address');
const CONST = require('../CONST');
const { assert } = require('../util');
const { decodeCfxAddress, ADDRESS_TYPES } = require('../util/address');
const PendingTransaction = require('../subscribe/PendingTransaction');
const Contract = require('../contract');
const RPCTypes = require('./types/index');

/**
 * @typedef { import('../Transaction').TransactionMeta } TransactionMeta
 */
class CFX extends RPCMethodFactory {
  constructor(conflux) {
    super(conflux);
    this.conflux = conflux;
    this._formatAddress = conflux._formatAddress.bind(conflux);
    // add RPC methods
    super.addMethods(this.methods());
    // decorate methods;
    this.sendRawTransaction = this._decoratePendingTransaction(this.sendRawTransaction);
    this.sendTransaction = this._decoratePendingTransaction(this.sendTransaction);
    this._addRequestBuilderToCustomMethods();
  }

  methods() {
    const formatAddressWithNetworkId = this._formatAddress;
    return [
      {
        method: 'cfx_clientVersion',
      },
      {
        method: 'cfx_getSupplyInfo',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: cfxFormat.supplyInfo,
      },
      {
        method: 'cfx_getStatus',
        responseFormatter: cfxFormat.status,
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
        responseFormatter: data => new RPCTypes.Account(data),
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
        responseFormatter: cfxFormat.voteList,
      },
      {
        method: 'cfx_getDepositList',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: cfxFormat.depositList,
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
        responseFormatter: cfxFormat.block.$or(null),
      },
      {
        method: 'cfx_getBlockByBlockNumber',
        requestFormatters: [
          format.bigUIntHex,
          format.boolean,
        ],
        responseFormatter: cfxFormat.block.$or(null),
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
        responseFormatter: cfxFormat.rewardInfo,
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
        responseFormatter: cfxFormat.block.$or(null),
      },
      {
        method: 'cfx_getBlockByHashWithPivotAssumption',
        requestFormatters: [
          format.blockHash,
          format.blockHash,
          format.epochNumber,
        ],
        responseFormatter: cfxFormat.block,
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
        responseFormatter: cfxFormat.transaction.$or(null),
      },
      {
        method: 'cfx_getTransactionReceipt',
        requestFormatters: [
          format.transactionHash,
        ],
        responseFormatter: cfxFormat.receipt.$or(null),
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
        responseFormatter: cfxFormat.sponsorInfo,
      },
      {
        method: 'cfx_getAccountPendingInfo',
        requestFormatters: [
          formatAddressWithNetworkId,
        ],
        responseFormatter: cfxFormat.accountPendingInfo,
      },
      {
        method: 'cfx_getAccountPendingTransactions',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.bigUIntHex.$or(undefined),
          format.bigUIntHex.$or(undefined),
        ],
        responseFormatter: cfxFormat.accountPendingTransactions,
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
        responseFormatter: cfxFormat.estimate,
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
        responseFormatter: cfxFormat.logs,
      },
      {
        method: 'cfx_getEpochReceipts',
        requestFormatters: [
          format.epochNumber,
        ],
        responseFormatter: cfxFormat.epochReceipts,
      },
      {
        method: 'cfx_getPoSEconomics',
        responseFormatter: cfxFormat.posEconomics,
      },
      {
        method: 'cfx_getParamsFromVote',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: cfxFormat.voteParamsInfo,
      },
      {
        method: 'cfx_getCollateralInfo',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: cfxFormat.collateralInfo,
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
        decoder: cfxFormat.estimate,
      };
    };
  }

  /**
   * Auto populate transaction info (chainId, epochNumber, nonce, gas, gasPrice, storageLimit)
   *
   * @param {TransactionMeta} options transaction info
   * @returns {Promise<TransactionMeta>} Polulated complete transaction
   */
  async populateTransaction(options) {
    const {
      defaultGasPrice,
      defaultGasRatio,
      defaultStorageRatio,
    } = this.conflux;

    options.from = this._formatAddress(options.from);

    if (options.nonce === undefined) {
      options.nonce = await this.conflux.advanced.getNextUsableNonce(options.from);
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

    if (options.gas === undefined || options.storageLimit === undefined) {
      let gas;
      let storageLimit;

      const isToUser = options.to && addressUtil.isValidCfxAddress(options.to) && decodeCfxAddress(options.to).type === ADDRESS_TYPES.USER;
      if (isToUser && !options.data) {
        gas = CONST.TRANSACTION_GAS;
        storageLimit = CONST.TRANSACTION_STORAGE_LIMIT;
      } else {
        const { gasUsed, storageCollateralized, gasLimit } = await this.estimateGasAndCollateral(options);
        if (defaultGasRatio) {
          gas = format.big(gasUsed).times(defaultGasRatio).toFixed(0);
          if (gas > 15000000) {
            gas = 15000000;
          }
        } else {
          gas = gasLimit;
        }
        storageLimit = format.big(storageCollateralized).times(defaultStorageRatio).toFixed(0);
      }

      if (options.gas === undefined) {
        options.gas = gas;
      }

      if (options.storageLimit === undefined) {
        options.storageLimit = storageLimit;
      }
    }

    if (options.gasPrice === undefined) {
      if (defaultGasPrice === undefined) {
        const gasPrice = await this.gasPrice();
        options.gasPrice = Number(gasPrice) === 0 ? CONST.MIN_GAS_PRICE : gasPrice;
      } else {
        options.gasPrice = defaultGasPrice;
      }
    }

    return options;
  }

  /**
   * Auto populate transaction and sign it with `from` 's privateKey in wallet
   *
   * @param {TransactionMeta} options transaction info
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
   * @param {TransactionMeta} options transaction info
   * @param {string} [password] Optional password to unlock account in fullnode
   * @return {Promise<string>} Transaction hash
   */
  async sendTransaction(options, ...extra) {
    if (this.conflux.wallet.has(`${options.from}`)) {
      const rawTx = await this.populateAndSignTransaction(options);
      return this.sendRawTransaction(rawTx);
    }

    return this.conflux.request({
      method: 'cfx_sendTransaction',
      params: [
        this.conflux._formatCallTx(options),
        ...extra,
      ],
    });
  }

  /**
   * Get epoch's receipt through pivot block's hash
   *
   * @param {string} pivotBlockHash Hash of pivot block
   * @returns {Promise<Array>} All receipts of one epoch
   */
  async getEpochReceiptsByPivotBlockHash(pivotBlockHash) {
    const result = await this.conflux.request({ method: 'cfx_getEpochReceipts', params: [`hash:${pivotBlockHash}`] });
    return cfxFormat.epochReceipts(result);
  }

  /**
   * Virtually call a contract, return the output data.
   *
   * @param {TransactionMeta} options - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param {string|number} [epochNumber='latest_state'] - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<string>} The output data.
   */
  async call(options, epochNumber) {
    try {
      if (options.to && addressUtil.hasNetworkPrefix(options.to) && this.conflux.networkId) {
        const {
          netId,
          // type,
        } = addressUtil.decodeCfxAddress(options.to);
        // check target address's networkId with current RPC's networkId
        assert(netId === this.conflux.networkId, '`to` address\'s networkId is not match current RPC\'s networkId');
        // check target contract is exist
        /* if (type === ADDRESS_TYPES.CONTRACT) {
          const code = await this.getCode(options.to);
          assert(code !== '0x', 'Contract not exist!');
        } */
      }

      return await this.conflux.request({
        method: 'cfx_call',
        params: [
          this.conflux._formatCallTx(options),
          format.epochNumber.$or(undefined)(epochNumber),
        ],
      });
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * Virtually call a contract, return the estimate gas used and storage collateralized.
   *
   * @param {TransactionMeta} options - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param {string|number} [epochNumber='latest_state'] - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<import('./types/formatter').EstimateResult>} A estimate result object:
   * - `BigInt` gasUsed: The gas used.
   * - `BigInt` gasLimit: The gas limit.
   * - `BigInt` storageCollateralized: The storage collateralized in Byte.
   */
  async estimateGasAndCollateral(options, epochNumber) {
    try {
      const result = await this.conflux.request({
        method: 'cfx_estimateGasAndCollateral',
        params: [
          this.conflux._formatCallTx(options),
          format.epochNumber.$or(undefined)(epochNumber),
        ],
      });
      return cfxFormat.estimate(result);
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }
}

module.exports = CFX;
