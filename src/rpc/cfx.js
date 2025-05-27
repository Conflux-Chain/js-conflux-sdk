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
    this.call = this._addRequestBuilderToCall();
    this.estimateGasAndCollateral = this._addRequestBuilderToEstimate();
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
        method: 'cfx_maxPriorityFeePerGas',
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getFeeBurnt',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_feeHistory',
        requestFormatters: [
          format.bigUIntHex,
          format.epochNumber,
          format.any, // f64 array
        ],
        responseFormatter: cfxFormat.feeHistory,
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
          format.epochNumberOrBlockHash,
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
          format.epochNumberOrBlockHash,
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
          format.epochNumberOrBlockHash,
        ],
        responseFormatter: format.any,
      },
      {
        method: 'cfx_getStorageAt',
        requestFormatters: [
          formatAddressWithNetworkId,
          format.hex64,
          format.epochNumberOrBlockHash,
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
        method: 'cfx_getPoSEconomics',
        requestFormatters: [
          format.epochNumberOrUndefined,
        ],
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
      {
        method: 'cfx_newFilter',
        requestFormatters: [
          format.getLogs,
        ],
      },
      {
        method: 'cfx_newBlockFilter',
      },
      {
        method: 'cfx_newPendingTransactionFilter',
      },
      {
        method: 'cfx_getFilterChanges',
        requestFormatters: [
          format.hex32,
        ],
        responseFormatter: cfxFormat.logs.$or(format([format.hex64])),
      },
      {
        method: 'cfx_getFilterLogs',
        requestFormatters: [
          format.hex32,
        ],
        responseFormatter: cfxFormat.logs,
      },
      {
        method: 'cfx_uninstallFilter',
        requestFormatters: [
          format.hex32,
        ],
      },
      {
        method: 'cfx_getEpochReceipts',
        debug: true,
        requestFormatters: [
          format.epochNumberOrBlockHash,
          format.boolean.$or(undefined),
        ],
        responseFormatter: cfxFormat.epochReceipts,
      },
      {
        method: 'debug_getTransactionsByEpoch',
        debug: true,
        requestFormatters: [
          format.bigUIntHex,
        ],
        responseFormatter: format([format.wrapTransaction]),
      },
      {
        method: 'debug_getTransactionsByBlock',
        debug: true,
        requestFormatters: [
          format.blockHash,
        ],
        responseFormatter: format([format.wrapTransaction]),
      },
      {
        method: 'debug_getEpochReceiptProofByTransaction',
        debug: true,
        requestFormatters: [
          format.transactionHash,
        ],
      },
    ];
  }

  _decoratePendingTransaction(func) {
    const cfx = this;
    return function (...args) {
      return new PendingTransaction(cfx, func.bind(this), args);
    };
  }

  _addRequestBuilderToCall() {
    const self = this;

    async function wrapper(options, epochNumber) {
      return self._call(options, epochNumber);
    }

    wrapper.request = function (options, epochNumber) {
      return {
        request: {
          method: 'cfx_call',
          params: [
            self.conflux._formatCallTx(options),
            format.epochNumberOrBlockHash(epochNumber),
          ],
        },
      };
    };

    return wrapper;
  }

  _addRequestBuilderToEstimate() {
    const self = this;

    async function wrapper(options, epochNumber) {
      return self._estimateGasAndCollateral(options, epochNumber);
    }

    wrapper.request = function (options, epochNumber) {
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

    return wrapper;
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

    if (options.gasPrice && (options.maxFeePerGas || options.maxPriorityFeePerGas)) {
      throw new Error('`gasPrice` should not be set with `maxFeePerGas` or `maxPriorityFeePerGas`');
    }

    // auto detect transaction type
    let baseFeePerGas;
    if (options.type === undefined) {
      const block = await this.getBlockByEpochNumber(options.epochHeight, false);
      baseFeePerGas = block.baseFeePerGas;

      const pre1559Type = options.accessList ? CONST.TRANSACTION_TYPE_EIP2930 : CONST.TRANSACTION_TYPE_LEGACY;
      options.type = baseFeePerGas ? CONST.TRANSACTION_TYPE_EIP1559 : pre1559Type;
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      let gas;
      let storageLimit;

      const isToUser = options.to && addressUtil.isValidCfxAddress(options.to) && decodeCfxAddress(options.to).type === ADDRESS_TYPES.USER;
      if (isToUser && !options.data && !options.accessList) {
        gas = CONST.TRANSACTION_GAS;
        storageLimit = CONST.TRANSACTION_STORAGE_LIMIT;
      } else {
        const { gasUsed, storageCollateralized } = await this.estimateGasAndCollateral(options);
        gas = gasUsed;
        storageLimit = storageCollateralized;
      }

      if (options.gas === undefined) {
        options.gas = gas;
      }

      if (options.storageLimit === undefined) {
        options.storageLimit = storageLimit;
      }
    }

    // auto fill gasPrice
    if (options.type === CONST.TRANSACTION_TYPE_LEGACY || options.type === CONST.TRANSACTION_TYPE_EIP2930) {
      if (options.gasPrice === undefined) {
        if (defaultGasPrice === undefined) {
          const gasPrice = await this.gasPrice();
          options.gasPrice = Number(gasPrice) === 0 ? CONST.MIN_GAS_PRICE : gasPrice;
        } else {
          options.gasPrice = defaultGasPrice;
        }
      }
      options.maxFeePerGas = undefined;
      options.maxPriorityFeePerGas = undefined;
    }
    // auto fill maxPriorityFeePerGas and maxFeePerGas
    if (options.type === CONST.TRANSACTION_TYPE_EIP1559) {
      if (options.gasPrice) {
        options.maxFeePerGas = options.gasPrice;
        options.maxPriorityFeePerGas = options.gasPrice;
        options.gasPrice = undefined;
      }

      if (!options.maxPriorityFeePerGas) {
        options.maxPriorityFeePerGas = await this.maxPriorityFeePerGas();
      }

      if (!options.maxFeePerGas) {
        if (!baseFeePerGas) {
          const block = await this.getBlockByEpochNumber(options.epochHeight, false);
          baseFeePerGas = block.baseFeePerGas;
        }

        options.maxFeePerGas = options.maxPriorityFeePerGas + baseFeePerGas * BigInt(2);
      }

      if (options.maxFeePerGas < options.maxPriorityFeePerGas) {
        throw new Error('`maxFeePerGas` should not be less than `maxPriorityFeePerGas`');
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
  async getEpochReceiptsByPivotBlockHash(pivotBlockHash, ...extra) {
    const result = await this.conflux.request({
      method: 'cfx_getEpochReceipts',
      params: [
        {
          blockHash: pivotBlockHash,
          requirePivot: true,
        },
        ...extra,
      ],
    });
    return cfxFormat.epochReceipts(result);
  }

  /**
   * Virtually call a contract, return the output data.
   *
   * @param {TransactionMeta} options - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param {string|number} [epochNumber='latest_state'] - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<string>} The output data.
   */
  async _call(options, epochNumber) {
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
  async _estimateGasAndCollateral(options, epochNumber) {
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
