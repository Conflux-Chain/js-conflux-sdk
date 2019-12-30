/*
 NOTE:
   - check Hex array before Hex, eg: `parse([BlockHash]).or(parse(BlockHash))`
   - check null before number, eg: `(parse.null).or(parse.number)`
 */

const isNull = require('lodash/isNull');
const isPlainObject = require('lodash/isPlainObject');
const isFunction = require('lodash/isFunction');
const defaults = require('lodash/defaults');
const mapValues = require('lodash/mapValues');
const BigNumber = require('bignumber.js');
const { Hex, TxHash, Hex32, Address, EpochNumber, BlockHash } = require('./type');

// ============================================================================
class Parser {
  constructor(func, { required = false, default: _default } = {}) {
    this.func = func;
    this.required = required;
    this.default = _default !== undefined ? func(_default) : undefined;

    return new Proxy(this.call.bind(this), {
      get: (_, key) => this[key],
    });
  }

  call(value) {
    if (value === undefined) {
      value = this.default;
    }

    if (value === undefined) {
      if (this.required) {
        throw new Error(`value is required, got ${value}`);
      }
      return undefined;
    }

    return this.func(value);
  }

  parse(func) {
    return new Parser((...args) => func(this(...args)));
  }

  validate(func) {
    return new Parser(value => {
      value = this(value);
      if (!func(value)) {
        throw new Error(`do not match validator ${func}`);
      }
      return value;
    });
  }

  or(func) {
    return new Parser(value => {
      try {
        return this(value);
      } catch (e) {
        return func(value);
      }
    });
  }
}

class ArrayParser extends Parser {
  constructor(func, options) {
    super(
      array => {
        if (!Array.isArray(array)) {
          throw new Error(`expected a array, got ${array}`);
        }
        return array.map(func);
      },
      options,
    );
  }
}

class ObjectParser extends Parser {
  constructor(keyToFunc, options) {
    super(
      object => {
        if (!isPlainObject(object)) {
          throw new Error(`expected a plain object, got ${object}`);
        }

        const picked = mapValues(keyToFunc, (func, key) => func(object[key]));
        return defaults(picked, object);
      },
      options,
    );
  }
}

function parse(schema, options = {}) {
  if (schema instanceof Parser) {
    return schema;
  }

  if (isFunction(schema)) {
    return new Parser(schema, options);
  }

  if (Array.isArray(schema)) {
    return new ArrayParser(parse(schema[0]), options);
  }

  if (isPlainObject(schema)) {
    return new ObjectParser(mapValues(schema, v => parse(v)), options);
  }

  throw new Error(`unknown schema type "${typeof schema}"`);
}

// ============================================================================
parse.boolean = v => Boolean(Number(v));
parse.number = Number;
parse.bigNumber = BigNumber;

parse.null = parse(v => v).validate(isNull);
parse.uint = parse(Number).validate(v => v >= 0).validate(Number.isInteger);

parse.transaction = parse({
  nonce: parse.number,
  value: parse.bigNumber,
  gasPrice: parse.bigNumber,
  gas: parse.bigNumber,
  v: parse.number,
  transactionIndex: (parse.null).or(parse.number),
  status: (parse.null).or(parse.number), // XXX: might be remove in rpc returned
});

parse.block = parse({
  epochNumber: parse.number,
  height: parse.number,
  size: parse.number,
  timestamp: parse.number,
  gasLimit: parse.bigNumber,
  difficulty: parse.bigNumber,
  transactions: [(parse.transaction).or(TxHash)],
  stable: (parse.null).or(parse.boolean),
});

parse.receipt = parse({
  index: parse.number, // XXX: number already in rpc return
  epochNumber: parse.number, // XXX: number already in rpc return
  outcomeStatus: parse.number, // XXX: number already in rpc return
  gasUsed: parse.bigNumber,
  logs: [
    {
      // FIXME: getTransactionReceipt returned log.data is array of number
      data: data => (Array.isArray(data) ? Hex(Buffer.from(data)) : data),
    },
  ],
});

parse.logs = parse([
  {
    epochNumber: parse.number,
    logIndex: parse.number,
    transactionIndex: parse.number,
    transactionLogIndex: parse.number,
  },
]);

// ----------------------------------------------------------------------------
parse.getLogs = parse({
  limit: Hex.fromNumber,
  fromEpoch: EpochNumber,
  toEpoch: EpochNumber,
  blockHashes: parse([BlockHash]).or(parse(BlockHash)),
  address: parse([Address]).or(parse(Address)),
  topics: [(parse.null).or(parse([Hex32])).or(parse(Hex32))],
});

module.exports = parse;
