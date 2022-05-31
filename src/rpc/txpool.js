const RPCMethodFactory = require('./index');
const format = require('../util/format');

/**
 * Class contains txpool RPC methods
 * @class
 */
class TxPool extends RPCMethodFactory {
  /**
   * TxPool constructor.
   * @param {import('../Conflux').Conflux} conflux A Conflux instance
   * @return {TxPool} The TxPool instance
   */
  constructor(conflux) {
    super(conflux);
    this.conflux = conflux;
    super.addMethods(this.methods());
  }

  methods() {
    return [
      /**
       * Get user next nonce in transaction pool
       * @instance
       * @async
       * @name nextNonce
       * @param {string} address The address of the account
       * @return {Promise<number>} The next usable nonce
       * @example <caption>Example usage of txpool.nextNonce</caption>
       * await conflux.txpool.nextNonce('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
       * // returns 100
       */
      {
        method: 'txpool_nextNonce',
        requestFormatters: [
          this.conflux._formatAddress.bind(this.conflux),
        ],
        responseFormatter: format.bigUInt,
      },
    ];
  }
}

module.exports = TxPool;
