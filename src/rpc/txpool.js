const RPCMethodFactory = require('./index');
const format = require('../util/format');

class TxPool extends RPCMethodFactory {
  constructor(provider, networkId) {
    super(provider);
    this.networkId = networkId;
    super.addMethods(this.methods());
  }

  _formatAddress(address) {
    if (!this.networkId) {
      console.warn('Conflux address: networkId is not set properly, please set it');
    }
    return format.address(address, this.networkId);
  }

  methods() {
    return [
      {
        method: 'txpool_nextNonce',
        requestFormatters: [
          this._formatAddress,
        ],
        responseFormatter: format.bigUInt,
      },
    ];
  }
}

module.exports = TxPool;
