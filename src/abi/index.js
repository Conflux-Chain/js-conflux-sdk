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
function formatSignature({ name, inputs }) {
  return `${name}(${inputs.map(param => getCoder(param).type).join(',')})`;
}

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
      inputs: [ { type: 'int' }, { type: 'bool' } ],
      outputs: [ { type: 'int' } ],
      type: 'func(int256,bool)'
    }
   */
  constructor({ name, inputs, outputs }) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.type = formatSignature({ name, inputs });
  }

  /**
   * Get function signature by abi (json interface)
   * @return {string}
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   * > coder.signature()
   "0x360ff942"
   */
  signature() {
    return format.hex(sha3(Buffer.from(this.type)).slice(0, 4));
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
   * > coder.encodeInputs([100, true])
   "0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001"
   */
  encodeInputs(array) {
    const coder = getCoder({ type: 'tuple', components: this.inputs });
    return format.hex(coder.encode(array));
  }

  /**
   * Decode hex with inputs by abi (json interface)
   *
   * @param hex {string} - Hex string
   * @return {array} NamedTuple
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   * > result = coder.decodeInputs('0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001')
   NamedTuple(0,1) [ 100n, true ]
   * > console.log([...result])
   [ 100n, true ]
   * > console.log(result[0])
   100
   * > console.log(result[1])
   true
   */
  decodeInputs(hex) {
    const coder = getCoder({ type: 'tuple', components: this.inputs });
    const stream = HexStream(hex);
    return coder.decode(stream);
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
    const coder = getCoder({ type: 'tuple', components: this.outputs });
    const stream = HexStream(hex);
    return coder.decode(stream);
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
  constructor({ anonymous, name, inputs }) {
    this.anonymous = anonymous;
    this.name = name;
    this.inputs = inputs;
    this.type = formatSignature({ name, inputs });

    this.NamedTuple = namedTuple(...inputs.map((input, index) => input.name || `${index}`));
  }

  /**
   * Get function signature by abi (json interface)
   * @return {string}
   *
   * @example
   * > coder = new EventCoder(abi)
   * > coder.signature()
   "0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7"
   */
  signature() {
    return format.hex(sha3(Buffer.from(this.type))); // {name:this.name, inputs:this.inputs}
  }

  /**
   * Encode input by index
   *
   * @param value {any}
   * @param index {number}
   * @return {string}
   *
   * @example
   * > coder = new EventCoder(abi)
   * > coder.encodeInputByIndex('0x123456789012345678901234567890123456789', 0)
   "0x0000000000000000000000000123456789012345678901234567890123456789"
   * > coder.encodeInputByIndex(10, 1)
   "0x000000000000000000000000000000000000000000000000000000000000000a"
   */
  encodeInputByIndex(value, index) {
    assert(index < this.inputs.length, {
      message: 'invalid index',
      expect: `<${this.inputs.length}`,
      got: index,
      coder: this,
    });

    const coder = getCoder(this.inputs[index]);
    return format.hex(coder.encode(value));
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
    const stream = HexStream(data);
    // XXX: for !this.anonymous, assert(topics[0] === this.signature)

    let index = this.anonymous ? 0 : 1;
    const array = this.inputs.map(input => {
      const coder = getCoder(input);

      if (input.indexed) {
        const result = coder.decode(HexStream(topics[index]));
        index += 1;
        return result;
      } else {
        return coder.decode(stream);
      }
    });

    return new this.NamedTuple(...array);
  }
}

// ----------------------------------------------------------------------------
module.exports = {
  formatSignature,
  FunctionCoder,
  EventCoder,
};
