/*
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html
 */

const { assert } = require('../util');
const { sha3 } = require('../util/sign');
const format = require('../util/format');

const getCoder = require('./coder');
const namedTuple = require('../lib/namedTuple');
const HexStream = require('./HexStream');

// ============================================================================
function signature(type) {
  return format.hex(sha3(Buffer.from(type)));
}

function formatSignature({ name, inputs }) {
  return `${name}(${inputs.map(param => getCoder(param).type).join(',')})`;
}

function formatFullName({ name, inputs }) {
  return `${name}(${inputs.map(param => `${getCoder(param).type} ${param.indexed ? 'indexed ' : ''}${param.name}`).join(', ')})`;
}

// ----------------------------------------------------------------------------
class FunctionCoder {
  /**
   * Function coder
   *
   * @param name {string}
   * @param [inputs] {array}
   * @param [outputs] {array}
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   FunctionCoder {
      name: 'func',
      fullName: 'func(int256 , bool )',
      inputs: [ { type: 'int' }, { type: 'bool' } ],
      outputs: [ { type: 'int' } ],
      type: 'func(int256,bool)'
    }
   */
  constructor({ name, inputs = [], outputs = [] }) {
    this.name = name; // example: "add"
    this.fullName = formatFullName({ name, inputs }); // example: "add(uint,uint)"
    this.type = formatSignature({ name, inputs }); // example: "add(uint number, uint count)"
    this.signature = signature(this.type).slice(0, 10); // example: "0xb8966352"

    this.inputCoder = getCoder({ type: 'tuple', components: inputs });
    this.outputCoder = getCoder({ type: 'tuple', components: outputs });
  }

  /**
   * Get function signature by abi (json interface)
   *
   * @param array {array}
   * @return {string}
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   * > coder.encodeData([100, true])
   "0x1eee72c100000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001"
   */
  encodeData(array) {
    const hex = format.hex(this.inputCoder.encode(array));
    return `${this.signature}${hex.substring(2)}`;
  }

  /**
   * Decode data hex with inputs by abi (json interface)
   *
   * @param hex {string} - Hex string
   * @return {array} NamedTuple
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   * > result = coder.decodeData('0x15fb272000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001')
   NamedTuple(0,1) [ 100n, true ]
   * > console.log([...result])
   [ 100n, true ]
   * > console.log(result[0])
   100
   * > console.log(result[1])
   true
   */
  decodeData(hex) {
    const prefix = hex.slice(0, this.signature.length);
    const data = hex.slice(this.signature.length);
    const stream = new HexStream(data);

    assert(prefix === this.signature, {
      message: 'decodeData unexpected signature',
      expect: this.signature,
      got: prefix,
      coder: this,
    });

    const result = this.inputCoder.decode(stream);
    assert(stream.eof(), {
      message: 'hex length to large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this,
    });

    return result;
  }

  /**
   * Decode hex with outputs by abi (json interface)
   *
   * @param hex {string} - Hex string
   * @return {array} NamedTuple
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   * > result = coder.decodeOutputs('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
   NamedTuple(0) [ -1n ]
   * > console.log([...result])
   [-1n]
   * > console.log(result[0])
   -1n
   */
  decodeOutputs(hex) {
    const stream = new HexStream(hex);
    const result = this.outputCoder.decode(stream);

    assert(stream.eof(), {
      message: 'hex length to large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this,
    });

    return result.length <= 1 ? result[0] : result;
  }
}

class ErrorCoder extends FunctionCoder {
  constructor() {
    super({ name: 'Error', inputs: [{ type: 'string', name: 'message' }] });
  }

  decodeError(error) {
    try {
      const { message } = this.decodeData(error.data);
      return new Error(message);
    } catch (e) {
      return error;
    }
  }
}

class EventCoder {
  /**
   * Event coder
   *
   * @param options {object}
   * @param options.anonymous {boolean}
   * @param options.name {string}
   * @param options.inputs {array}
   *
   * @example
   * > abi = {
    name: 'EventName',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
   }
   * > coder = new EventCoder(abi)
   EventCoder {
      anonymous: false,
      name: 'EventName',
      inputs: [
        { indexed: true, name: 'account', type: 'address' },
        { indexed: false, name: 'number', type: 'uint' }
      ],
      type: 'EventName(address,uint256)',
      NamedTuple: [Function: NamedTuple(account,number)]
    }
   */
  constructor({ anonymous, name, inputs = [] } = {}) {
    this.anonymous = anonymous;
    this.name = name; // example: "Event"
    this.fullName = formatFullName({ name, inputs }); // example: "Event(address)"
    this.type = formatSignature({ name, inputs }); // example: "Event(address indexed account)"
    this.signature = signature(this.type); // example: "0x50d7c806d0f7913f321946784dee176a42aa55b5dd83371fc57dcedf659085e0"

    this.inputs = inputs;
    this.dataCoder = getCoder({ type: 'tuple', components: inputs.filter(component => !component.indexed) });

    this.NamedTuple = namedTuple(...inputs.map((input, index) => input.name || `${index}`));
  }

  /**
   * Encode topics by params
   *
   * @param array {*[]}
   * @return {string[]}
   * @example
   * > coder = new EventCoder(abi)
   * > coder.encodeTopics(['0x0123456789012345678901234567890123456789', null])
   ['0x0000000000000000000000000123456789012345678901234567890123456789']
   */
  encodeTopics(array) {
    assert(array.length === this.inputs.length, {
      message: 'length not match',
      expect: this.inputs.length,
      got: array.length,
      coder: this,
    });

    const topics = [];
    this.inputs.forEach((component, index) => {
      if (component.indexed) {
        const value = array[index];

        topics.push(value === null ? null : format.hex(getCoder(component).encodeIndex(value)));
      }
    });

    return topics;
  }

  /**
   * Decode log
   *
   * @param topics {array} - Array of hex sting
   * @param data {string} - Hex string
   * @return {array} NamedTuple
   *
   * @example
   * > coder = new EventCoder(abi)
   * > result = coder.decodeLog({
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      topics: [
        '0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7',
        '0x0000000000000000000000000123456789012345678901234567890123456789',
      ],
    })
   NamedTuple(account,number) [ '0x0123456789012345678901234567890123456789', 10n ]
   * > console.log([...result])
   [ 0x0123456789012345678901234567890123456789, 10n ]
   * > console.log(result.account) // `account` a field name in abi
   "0x0123456789012345678901234567890123456789"
   * > console.log(result.number) // `number` a field name in abi
   10n
   */
  decodeLog({ topics, data }) {
    assert(this.anonymous || topics[0] === this.signature, {
      message: 'decodeLog unexpected topic',
      expect: this.signature,
      got: topics[0],
      coder: this,
    });

    const stream = new HexStream(data);
    const notIndexedNamedTuple = this.dataCoder.decode(stream);

    assert(stream.eof(), {
      message: 'hex length to large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this,
    });

    let offset = this.anonymous ? 0 : 1;
    const array = this.inputs.map(component => {
      if (component.indexed) {
        return getCoder(component).decodeIndex(topics[offset++]); // eslint-disable-line no-plusplus
      } else {
        return notIndexedNamedTuple[component.name];
      }
    });

    return new this.NamedTuple(...array);
  }
}

module.exports = {
  formatSignature,
  formatFullName,
  FunctionCoder,
  EventCoder,
  errorCoder: new ErrorCoder(),
};
