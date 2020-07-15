const JSBI = require('jsbi');
const lodash = require('lodash');
const { assert, format } = require('../util');
const BaseCoder = require('./BaseCoder');
const { padBuffer, decodeUInt256 } = require('./util');

class BoolCoder extends BaseCoder {
  static from({ type, name }) {
    if (type !== 'bool') {
      return undefined;
    }
    return new this({ type, name });
  }

  /**
   * @param value {*}
   * @return {Buffer}
   */
  encode(value) {
    assert(lodash.isBoolean(value), {
      message: 'unexpected type',
      expect: 'boolean',
      got: value,
      coder: this,
    });

    return padBuffer(format.hex(value));
  }

  /**
   * @param stream {HexStream}
   * @return {boolean}
   */
  decode(stream) {
    return JSBI.notEqual(decodeUInt256(stream), JSBI.BigInt(0));
  }
}

module.exports = BoolCoder;
