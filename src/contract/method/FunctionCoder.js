const { assert } = require('../../util');
const format = require('../../util/format');
const HexStream = require('../../util/HexStream');
const { formatType, formatFullName, valueCoder } = require('../abi');

class FunctionCoder {
  /**
   * Function coder
   *
   * @param {object} options
   * @param {string} [options.name]
   * @param {array} [options.inputs]
   * @param {array} [options.outputs]
   * @param {string} [options.stateMutability='nonpayable']
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
  constructor({ name, inputs = [], outputs = [], stateMutability = 'nonpayable' }) {
    this.name = name; // example: "add"
    this.fullName = formatFullName({ name, inputs }); // example: "add(uint number, uint count)"
    this.type = formatType({ name, inputs }); // example: "add(uint,uint)"
    this.signature = format.keccak256(this.type).slice(0, 10); // example: "0xb8966352"
    this.stateMutability = stateMutability;

    this.inputCoder = valueCoder({ type: 'tuple', components: inputs });
    this.outputCoder = valueCoder({ type: 'tuple', components: outputs });
  }

  /**
   * Get function signature by abi (json interface)
   *
   * @param {array} args
   * @return {string}
   *
   * @example
   * > abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
   * > coder = new FunctionCoder(abi)
   * > coder.encodeData([100, true])
   "0x1eee72c100000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001"
   */
  encodeData(args) {
    const hex = format.hex(this.inputCoder.encode(args));
    return `${this.signature}${hex.substring(2)}`;
  }

  /**
   * Decode data hex with inputs by abi (json interface)
   *
   * @param {string} hex  - Hex string
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
    assert(prefix === this.signature, {
      message: 'decodeData unexpected signature',
      expect: this.signature,
      got: prefix,
      coder: this.fullName,
    });

    const data = hex.slice(this.signature.length);
    const stream = new HexStream(data);
    const tuple = this.inputCoder.decode(stream);
    assert(stream.eof(), {
      message: 'hex length too large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this.fullName,
    });

    return tuple;
  }

  /**
   * Decode hex with outputs by abi (json interface)
   *
   * @param {string} hex - Hex string
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
    const tuple = this.outputCoder.decode(stream);

    assert(stream.eof(), {
      message: 'hex length too large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this.fullName,
    });

    return tuple.length <= 1 ? tuple[0] : tuple;
  }
}

module.exports = FunctionCoder;
