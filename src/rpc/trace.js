const RPCMethodFactory = require('./index');
const format = require('../util/format');

format.action = format({
  action: {
    from: format.any,
    to: format.any,
    fromPocket: format.any,
    toPocket: format.any,
    value: format.bigUInt,
    gas: format.bigUInt,
    gasLeft: format.bigUInt,
    input: format.hex,
    init: format.hex,
    returnData: format.hex,
    callType: format.any,
    outcome: format.any,
    addr: format.any,
  },
  epochNumber: format.bigUInt,
  epochHash: format.hex,
  blockHash: format.hex,
  transactionHash: format.hex,
  transactionPosition: format.bigUInt,
  type: format.any,
  valid: format.any,
}, { pick: true });

// only used in block traces
format.txTraces = format({
  traces: [format.action],
  transactionPosition: format.bigUInt,
});

format.blockTraces = format({
  transactionTraces: [format.txTraces],
  epochNumber: format.bigUInt,
}).$or(null);

// trace array
format.traces = format([format.action]).$or(null);

format.traceFilter = format({
  fromEpoch: format.epochNumber.$or(null),
  toEpoch: format.epochNumber.$or(null),
  blockHashes: format([format.blockHash]).$or(null),
  after: format.bigUIntHex.$or(null),
  count: format.bigUIntHex.$or(null),
  actionTypes: format([format.any]).$or(null),
});

class Trace extends RPCMethodFactory {
  constructor(conflux) {
    super(conflux, Trace.methods());
    this.conflux = conflux;
  }

  static methods() {
    return [
      {
        method: 'trace_block',
        alias: 'traceBlock',
        requestFormatters: [
          format.blockHash,
        ],
        responseFormatter: format.blockTraces,
      },
      {
        method: 'trace_transaction',
        alias: 'traceTransaction',
        requestFormatters: [
          format.transactionHash,
        ],
        responseFormatter: format.traces,
      },
      {
        method: 'trace_filter',
        alias: 'traceFilter',
        requestFormatters: [
          format.traceFilter,
        ],
        responseFormatter: format.traces,
      },
    ];
  }
}

module.exports = Trace;
