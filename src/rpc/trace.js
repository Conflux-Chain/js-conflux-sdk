const RPCMethodFactory = require('./index');
const format = require('../util/format');

class Trace extends RPCMethodFactory {
  constructor(provider) {
    super(provider, Trace.methods());
    this.provider = provider;
  }

  static methods() {
    return [
      {
        method: 'trace_block',
        requestFormatters: [
          format.blockHash,
        ],
        responseFormatter: format.blockTraces,
      },
      {
        method: 'trace_transaction',
        requestFormatters: [
          format.transactionHash,
        ],
        responseFormatter: format.traces,
      },
      {
        method: 'trace_filter',
        requestFormatters: [
          format.traceFilter,
        ],
        responseFormatter: format.traces,
      },
    ];
  }
}

module.exports = Trace;
