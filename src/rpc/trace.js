const RPCMethodFactory = require('./index');
const format = require('../util/format');

/**
 * @typedef {Object} ActionCall
 * @prop {string} space
 * @prop {string} from
 * @prop {string} to
 * @prop {BigInt} value
 * @prop {string} callType
 * @prop {string} input
 * @prop {BigInt} gas
 */
format.actionCall = format({
  space: format.any,
  from: format.any,
  to: format.any,
  input: format.any,
  callType: format.any,
  value: format.bigUInt,
  gas: format.bigUInt,
});

/**
 * @typedef {Object} ActionCallResult
 * @prop {string} space
 * @prop {string} returnData
 * @prop {BigInt} gasLeft
 */
format.actionCallResult = format({
  outcome: format.any,
  returnData: format.any,
  gasLeft: format.bigUInt,
});

/**
 * @typedef {Object} ActionCreate
 * @prop {string} space
 * @prop {string} from
 * @prop {string} init
 * @prop {BigInt} value
 * @prop {BigInt} gas
 * @prop {string} createType
 */
format.actionCreate = format({
  space: format.any,
  from: format.any,
  value: format.bigUInt,
  gas: format.bigUInt,
  init: format.any,
  createType: format.any,
});

/**
 * @typedef {Object} ActionCreateResult
 * @prop {string} outcome
 * @prop {string} returnData
 * @prop {BigInt} gasLeft
 * @prop {string} addr
 */
format.actionCreateResult = format({
  outcome: format.any,
  addr: format.any,
  gasLeft: format.bigUInt,
  returnData: format.any,
});

/**
 * @typedef {Object} ActionInternal
 * @prop {string} from
 * @prop {string} to
 * @prop {string} fromPocket
 * @prop {string} toPocket
 * @prop {BigInt} value
 * @prop {string} fromSpace
 * @prop {string} toSpace
 */
format.actionInternalTrace = format({
  from: format.any,
  fromPocket: format.any,
  fromSpace: format.any,
  to: format.any,
  toPocket: format.any,
  toSpace: format.any,
  value: format.bigUInt,
});

/**
 * @typedef {ActionCall|ActionCallResult|ActionCreate|ActionCreateResult|ActionInternal} Action
 */

/**
 * @typedef {Object} Trace
 * @prop {Action} action
 * @prop {number} epochNumber
 * @prop {string} epochHash
 * @prop {string} blockHash
 * @prop {string} transactionHash
 * @prop {string} transactionPosition
 * @prop {string} type
 * @prop {boolean} valid
 */
format.action = format({
  action: {
    from: format.any,
    to: format.any,
    fromPocket: format.any,
    toPocket: format.any,
    space: format.any, // From conflux v2.0, create/call trace will have this field
    fromSpace: format.any, // From conflux v2.0, internal_transfer_action will have this field
    toSpace: format.any, // From conflux v2.0, internal_transfer_action will have this field
    value: format.bigUInt,
    gas: format.bigUInt,
    gasLeft: format.bigUInt,
    input: format.hex,
    init: format.hex,
    returnData: format.hex,
    callType: format.any,
    createType: format.any,
    outcome: format.any,
    addr: format.any,
  },
  epochNumber: format.uInt,
  epochHash: format.hex,
  blockHash: format.hex,
  transactionHash: format.hex,
  transactionPosition: format.uInt,
  type: format.any,
  valid: format.any,
}, { pick: true });

// only used in block traces
format.txTraces = format({
  traces: [format.action],
  transactionPosition: format.uInt,
});

format.blockTraces = format({
  transactionTraces: [format.txTraces],
  epochNumber: format.uInt,
}).$or(null);

// trace array
format.traces = format([format.action]).$or(null);

/**
 * @typedef {object} TraceFilter
 * @property {number} [fromEpoch]
 * @property {number} [toEpoch]
 * @property {string|string[]} [fromAddress]
 * @property {string|string[]} [toAddress]
 * @property {string[]} [blockHashes]
 * @property {number} [after]
 * @property {number} [count]
 * @property {string[]|string} [actionTypes]
 */
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
