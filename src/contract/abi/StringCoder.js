const lodash = require('lodash');
const { assert } = require('../../util');
const BytesCoder = require('./BytesCoder');

class StringCoder extends BytesCoder {
  static from({ type, name }) {
    if (type !== 'string') {
      return undefined;
    }
    return new this({ type, name });
  }

  constructor({ type, name }) {
    super({ name, size: undefined });
    this.type = type;
  }

  /**
   * @param value {string} - string in utf8
   * @return {Buffer}
   */
  encode(value) {
    assert(lodash.isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encode(Buffer.from(value, 'utf8'));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    const bytes = super.decode(stream);
    return bytes.toString('utf8');
  }

  encodeTopic(value) {
    assert(lodash.isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encodeTopic(Buffer.from(value, 'utf8'));
  }
}

module.exports = StringCoder;
