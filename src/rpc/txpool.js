const RPCMethodFactory = require('./index');
const format = require('../util/format');

/**
 * Class contains txpool RPC methods
 * @class
 */
class TxPool extends RPCMethodFactory {
  /**
   * TxPool constructor.
   *
   * @param {object} conflux - A Conflux instance
   * @return {object} The TxPool instance
   */
  constructor(conflux) {
    super(conflux);
    this.conflux = conflux;
    super.addMethods(this.methods());
  }

  methods() {
    return [
      /**
       * Get user next nonce in txpool
       * @async
       * @name nextNonce
       * @param {string} address - The address of the account
       * @return {Promise<number>} - The next usable nonce
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
