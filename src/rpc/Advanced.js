const Big = require('big.js');
const CONST = require('../CONST');
const format = require('../util/format');

class AdvancedRPCUtilities {
  constructor(conflux) {
    this.conflux = conflux;
  }

  /**
   * First try to use txpool_nextNonce method, if failed use cfx_getNextNonce
   *
   * @param {string} address - The address to get nonce
   * @returns {Promise<BigInt>}
   */
  async getNextUsableNonce(address) {
    address = this.conflux._formatAddress(address);
    let nonce;
    try {
      nonce = await this.conflux.txpool.nextNonce(address);
    } catch (e) {
      nonce = await this.conflux.cfx.getNextNonce(address);
    }
    return nonce;
  }

  /**
   * Get PoS interest rate
   *
   * @returns {Promise<string>} PoS interest rate
   */
  async getPoSInterestRate() {
    const RATIO = new Big(0.04);
    const batchRequest = this.conflux.BatchRequest();
    batchRequest.add(this.conflux.cfx.getSupplyInfo.request());
    batchRequest.add(this.conflux.cfx.getPoSEconomics.request());
    batchRequest.add(this.conflux.cfx.getBalance.request(CONST.ZERO_ADDRESS_HEX));
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
   * A advance method to check whether user's balance is enough to pay one transaction
   *
   * @param {Object} options Transaction info
   * @param {string|number} [epochNumber] Optional epoch number
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
    const estimateResult = await this.conflux.cfx.estimateGasAndCollateral(options, epochNumber);
    if (!options.from) {
      throw new Error('Can not check balance without `from`');
    }
    options = this.conflux._formatCallTx(options);
    const gasPrice = format.bigInt(options.gasPrice || BigInt(1));
    const txValue = format.bigInt(options.value || BigInt(0));
    const gasFee = gasPrice * estimateResult.gasLimit;
    const storageFee = estimateResult.storageCollateralized * (BigInt(1e18) / BigInt(1024));
    const balance = await this.conflux.cfx.getBalance(options.from);
    estimateResult.balance = balance;
    if (!options.to) {
      estimateResult.willPayCollateral = true;
      estimateResult.willPayTxFee = true;
      estimateResult.isBalanceEnough = balance > (gasFee + storageFee);
      estimateResult.isBalanceEnoughForValueAndFee = balance > (gasFee + storageFee + txValue);
    } else {
      const checkResult = await this.conflux.cfx.checkBalanceAgainstTransaction(
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

module.exports = AdvancedRPCUtilities;
