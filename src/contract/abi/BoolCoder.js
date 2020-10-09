const JSBI = require('jsbi');
const lodash = require('lodash');
const { assert } = require('../../util');
const BaseCoder = require('./BaseCoder');
const { uIntCoder } = require('./IntegerCoder');

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

    return uIntCoder.encode(value ? 1 : 0);
  }

  /**
   * @param stream {HexStream}
   * @return {boolean}
   */
  decode(stream) {
    return JSBI.notEqual(uIntCoder.decode(stream), JSBI.BigInt(0));
  }
}

module.exports = BoolCoder;
