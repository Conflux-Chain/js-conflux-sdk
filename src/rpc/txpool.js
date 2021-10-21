const RPCMethodFactory = require('./index');
const format = require('../util/format');

class TxPool extends RPCMethodFactory {
  constructor(provider) {
    super(provider, TxPool.methods());
    this.provider = provider;
  }

  static methods() {
    return [
      {
        method: 'txpool_nextNonce',
        requestFormatters: [
          format.blockHash,
        ],
        responseFormatter: format.any,
      },
    ];
  }
}

module.exports = TxPool;
