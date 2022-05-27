const lodash = require('lodash');
const { assert } = require('../../util');
const BytesCoder = require('./BytesCoder');

class StringCoder extends BytesCoder {
  static from({ type, ...options }) {
    if (type !== 'string') {
      return undefined;
    }
    return new this({ ...options, type });
  }

  constructor({ type, name }) {
    super({ name, size: undefined });
    this.type = type;
  }

  /**
   * @param {string} value - string in utf8
   * @return {Buffer}
   */
  encode(value) {
    assert(lodash.isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encode(Buffer.from(value));
  }

  /**
   * @param {import('../../util/HexStream')} stream
   * @return {string}
   */
  decode(stream) {
    const bytes = super.decode(stream);
    return bytes.toString();
  }

  encodeTopic(value) {
    assert(lodash.isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encodeTopic(Buffer.from(value));
  }
}

module.exports = StringCoder;
