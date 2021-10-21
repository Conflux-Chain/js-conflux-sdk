const Big = require('big.js');
const RPCMethodFactory = require('./index');
const format = require('../util/format');
const CONST = require('../CONST');
const { decodeCfxAddress, ADDRESS_TYPES } = require('../util/address');
const PendingTransaction = require('../subscribe/PendingTransaction');
const Contract = require('../contract');

class CFX extends RPCMethodFactory {
  constructor({
    provider,
    networkId,
    useHexAddressInParameter,
    wallet,
    defaultGasPrice,
    defaultGasRatio = 1.1,
    defaultStorageRatio = 1.1,
  }) {
    super(provider);
    this.provider = provider;
    this.networkId = networkId;
    this.useHexAddressInParameter = useHexAddressInParameter;
    this.wallet = wallet;
    this.defaultGasPrice = defaultGasPrice;
    this.defaultGasRatio = defaultGasRatio;
    this.defaultStorageRatio = defaultStorageRatio;
    super.addMethods(this.methods());
    this.sendRawTransaction = this._decoratePendingTransaction(this.sendRawTransaction);
    this.sendTransaction = this._decoratePendingTransaction(this.sendTransaction);
    this._addRequestBuilderToCustomMethods();
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

  methods() {
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
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.account,
      },
      {
        method: 'cfx_getBalance',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getStakingBalance',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getNextNonce',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      {
        method: 'cfx_getAdmin',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
      },
      {
        method: 'cfx_getVoteList',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.voteList,
      },
      {
        method: 'cfx_getDepositList',
        requestFormatters: [
          this._formatAddress.bind(this),
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
          this._formatAddress.bind(this),
          format.epochNumber.$or(undefined),
        ],
        responseFormatter: format.any,
      },
      {
        method: 'cfx_getStorageAt',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.hex64,
          format.epochNumber.$or(undefined),
        ],
      },
      {
        method: 'cfx_getStorageRoot',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
      },
      {
        method: 'cfx_getSponsorInfo',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.sponsorInfo,
      },
      {
        method: 'cfx_getAccountPendingInfo',
        requestFormatters: [
          this._formatAddress.bind(this),
        ],
        responseFormatter: format.accountPendingInfo,
      },
      {
        method: 'cfx_getAccountPendingTransactions',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.bigUIntHex.$or(undefined),
          format.bigUIntHex.$or(undefined),
        ],
        responseFormatter: format.accountPendingTransactions,
      },
      {
        method: 'cfx_getCollateralForStorage',
        requestFormatters: [
          this._formatAddress.bind(this),
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.bigUInt,
      },
      /* {
        method: 'cfx_call',
        requestFormatters: [
          this._formatCallTx,
          format.epochNumberOrUndefined,
        ],
        responseFormatter: format.any, // TODO catch exception and decode error
      },
      {
        method: 'cfx_estimateGasAndCollateral',
        requestFormatters: [
          this._formatCallTx,
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
          this._formatGetLogs.bind(this),
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
            self._formatCallTx(options),
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
            self._formatCallTx(options),
            format.epochNumber.$or(undefined)(epochNumber),
          ],
        },
        decoder: format.estimate,
      };
    };

    /* // TODO the request here is different with others, need to fix it
    this.sendTransaction.request = async function (options, password) {
      if (self.wallet.has(`${options.from}`)) {
        const transaction = await self._signTransaction(options);
        return {
          request: {
            method: 'cfx_sendRawTransaction',
            params: [
              transaction.serialize(),
            ],
          },
        };
      }

      return {
        request: {
          method: 'cfx_sendTransaction',
          params: [
            self._formatCallTx(options),
            password,
          ],
        },
      };
    }; */
  }

  async populateTransaction(options) {
    options.from = this._formatAddress(options.from);

    if (options.nonce === undefined) {
      options.nonce = await this.getNextNonce(options.from);
    }

    if (options.chainId === undefined) {
      options.chainId = this.networkId;
    }

    if (options.chainId === undefined) {
      const status = await this.getStatus();
      options.chainId = status.chainId;
    }

    if (options.epochHeight === undefined) {
      options.epochHeight = await this.epochNumber();
    }

    if (options.gasPrice === undefined) {
      if (this.defaultGasPrice === undefined) {
        const gasPrice = await this.gasPrice();
        options.gasPrice = Number(gasPrice) === 0 ? CONST.MIN_GAS_PRICE : gasPrice;
      } else {
        options.gasPrice = this.defaultGasPrice;
      }
    }

    if (options.gas === undefined || options.storageLimit === undefined) {
      let gas;
      let storageLimit;

      const isContract = decodeCfxAddress(options.from).type === ADDRESS_TYPES.CONTRACT;
      if (options.data || isContract) {
        const { gasUsed, storageCollateralized, gasLimit } = await this.estimateGasAndCollateral(options);
        if (this.defaultGasRatio) {
          gas = format.big(gasUsed).times(this.defaultGasRatio).toFixed(0);
        } else {
          gas = gasLimit;
        }
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

    return options;
  }

  async populateAndSignTransaction(options) {
    await this.populateTransaction(options);
    const account = await this.wallet.get(`${options.from}`);
    const signedTx = await account.signTransaction(options);
    return signedTx.serialize();
  }

  async sendTransaction(options, password) {
    if (this.wallet.has(`${options.from}`)) {
      const rawTx = await this.populateAndSignTransaction(options);
      return this.sendRawTransaction(rawTx);
    }

    return this.provider.call('cfx_sendTransaction',
      this._formatCallTx(options),
      password,
    );
  }

  async getPoSInterestRate() {
    const RATIO = new Big(0.04);
    const { totalCirculating } = await this.getSupplyInfo();
    const { totalPosStakingTokens } = await this.getPoSEconomics();
    const bigTotalStaking = new Big(totalCirculating);
    const bigTotalPosStakingTokens = new Big(totalPosStakingTokens);
    const bigRatio = RATIO.div(bigTotalPosStakingTokens.div(bigTotalStaking).sqrt());
    return bigRatio.toString();
  }

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
}

module.exports = CFX;
