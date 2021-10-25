const RPCMethodFactory = require('./index');
const format = require('../util/format');

class TxPool extends RPCMethodFactory {
  constructor(conflux) {
    super(conflux);
    this.conflux = conflux;
    super.addMethods(this.methods());
  }

  methods() {
    return [
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
