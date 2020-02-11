import { sleep, loop } from '../util';
import LazyPromise from './LazyPromise';

export default class PendingTransaction extends LazyPromise {
  constructor(cfx, func, params) {
    super(func, params);
    this.cfx = cfx;
  }

  /**
   * Get transaction by hash.
   *
   * @param [options] {object}
   * @param [options.delay=0] {number} - Defer execute after `delay` ms.
   * @return {Promise<Object|null>} See `Conflux.getTransactionByHash`
   */
  async get({ delay = 0 } = {}) {
    await sleep(delay);
    const txHash = await this;
    return this.cfx.getTransactionByHash(txHash);
  }

  /**
   * Async wait till transaction been mined.
   *
   * - blockHash !== null
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=30*1000] {number} - Loop timeout in ms.
   * @return {Promise<object>} See `Conflux.getTransactionByHash`
   */
  async mined({ delta = 1000, timeout = 60 * 1000 } = {}) {
    return loop({ delta, timeout }, async () => {
      const tx = await this.get();
      if (tx && tx.blockHash) {
        return tx;
      }

      return undefined;
    });
  }

  /**
   * Async wait till transaction been executed.
   *
   * - mined
   * - receipt !== null
   * - receipt.outcomeStatus === 0
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=60*1000] {number} - Loop timeout in ms.
   * @return {Promise<object>} See `Conflux.getTransactionReceipt`
   */
  async executed({ delta = 1000, timeout = 5 * 60 * 1000 } = {}) {
    const txHash = await this;
    return loop({ delta, timeout }, async () => {
      const receipt = await this.cfx.getTransactionReceipt(txHash);
      if (receipt) {
        if (receipt.outcomeStatus !== 0) {
          throw new Error(`transaction "${txHash}" executed failed, outcomeStatus ${receipt.outcomeStatus}`);
        }

        return receipt;
      }

      return undefined;
    });
  }

  /**
   * Async wait till transaction been confirmed.
   *
   * - executed
   * - transaction block risk coefficient < threshold
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=5*60*1000] {number} - Loop timeout in ms.
   * @param [options.threshold=0.01] {number} - Number in range (0,1)
   * @return {Promise<object>} See `Conflux.getTransactionReceipt`
   */
  async confirmed({ threshold = 0.01, delta = 1000, timeout = 30 * 60 * 1000 } = {}) {
    return loop({ delta, timeout }, async () => {
      const receipt = await this.executed({ delta, timeout });
      const risk = await this.cfx.getRiskCoefficient(receipt.epochNumber);
      if (risk < threshold) {
        return receipt;
      }

      return undefined;
    });
  }
}
