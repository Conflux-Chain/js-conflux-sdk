const { assert, format } = require('../util');
const HexStream = require('../util/HexStream');
const abiCoder = require('../abi');
const { signature, formatSignature, formatFullName } = require('./signature');

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

    this.inputCoder = abiCoder({ type: 'tuple', components: inputs });
    this.outputCoder = abiCoder({ type: 'tuple', components: outputs });
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

module.exports = FunctionCoder;
