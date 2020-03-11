/*
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html
 */

import { assert } from '../util';
import { sha3 } from '../util/sign';
import format from '../util/format';

import { getCoder } from './coder';
import namedTuple from '../lib/namedTuple';
import HexStream from './HexStream';

// ============================================================================
export function formatSignature({ name, inputs }) {
  return `${name}(${inputs.map(param => getCoder(param).type).join(',')})`;
}

export class FunctionCoder {
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
  constructor({ name, inputs = [], outputs = [] }) {
    this.name = name;
    // this.inputs = inputs;
    // this.outputs = outputs;

    this.type = formatSignature({ name, inputs });
    this.inputCoder = getCoder({ type: 'tuple', components: inputs });
    this.outputCoder = getCoder({ type: 'tuple', components: outputs });
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
    return format.hex(this.inputCoder.encode(array));
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
    const stream = HexStream(hex);
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
    const stream = HexStream(hex);
    const result = this.outputCoder.decode(stream);

    assert(stream.eof(), {
      message: 'hex length to large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this,
    });

    return result;
  }
}

export class EventCoder {
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
    this.inputCoder = getCoder({ type: 'tuple', components: inputs });
    this.notIndexedCoder = getCoder({ type: 'tuple', components: inputs.filter(component => !component.indexed) });

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
   * > coder.encodeIndex('0x123456789012345678901234567890123456789', 0)
   "0x0000000000000000000000000123456789012345678901234567890123456789"
   * > coder.encodeIndex(10, 1)
   "0x000000000000000000000000000000000000000000000000000000000000000a"
   */
  encodeIndex(value, index) {
    const { indexed } = this.inputs[index] || {};
    assert(indexed, {
      message: 'component not indexed',
      expect: `${index} to be indexed`,
      got: indexed,
      coder: this,
    });

    return format.hex(this.inputCoder.coders[index].encodeIndex(value));
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
    // XXX: for !this.anonymous, assert(topics[0] === this.signature)

    const notIndexedNamedTuple = this.notIndexedCoder.decode(HexStream(data));

    let offset = this.anonymous ? 0 : 1;

    const array = this.inputs.map((component, index) => {
      if (component.indexed) {
        const result = this.inputCoder.coders[index].decodeIndex(topics[offset]);
        offset += 1;
        return result;
      } else {
        return notIndexedNamedTuple[component.name];
      }
    });

    return new this.NamedTuple(...array);
  }
}

const ERROR_CODER = new FunctionCoder({
  name: 'Error',
  inputs: [
    { type: 'string', name: 'message' },
  ],
});
const ERROR_CODE = ERROR_CODER.signature();

export function decodeError(hex) {
  if (!hex.startsWith(ERROR_CODE)) {
    return undefined;
  }

  const params = ERROR_CODER.decodeInputs(hex.slice(ERROR_CODE.length));
  return Error(params.message);
}
