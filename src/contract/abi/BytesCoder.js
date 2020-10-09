const { WORD_BYTES } = require('../../CONST');
const { assert, alignBuffer } = require('../../util');
const sign = require('../../util/sign');
const BaseCoder = require('./BaseCoder');
const { uIntCoder } = require('./IntegerCoder');

class BytesCoder extends BaseCoder {
  static from({ type, name }) {
    const match = type.match(/^bytes([0-9]*)$/);
    if (!match) {
      return undefined;
    }

    const [, size] = match;
    return new this({
      name,
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  constructor({ name, size }) {
    if (size !== undefined) {
      assert(Number.isInteger(size) && size <= WORD_BYTES, {
        message: 'invalid size',
        expect: `integer && <=${WORD_BYTES}`,
        got: size,
        coder: { name },
      });
    }

    super({ name });
    this.type = `bytes${size > 0 ? size : ''}`;
    this.size = size;
    this.dynamic = Boolean(size === undefined);
  }

  /**
   * @param value {ArrayLike}
   * @return {Buffer}
   */
  encode(value) {
    value = Buffer.isBuffer(value) ? value : Buffer.from(value);

    if (this.size !== undefined) {
      assert(value.length === this.size, {
        message: 'length not match',
        expect: this.size,
        got: value.length,
        coder: this,
      });
    }

    let buffer = alignBuffer(value, true);
    if (this.size === undefined) {
      buffer = Buffer.concat([uIntCoder.encode(value.length), buffer]);
    }
    return buffer;
  }

  /**
   * @param stream {HexStream}
   * @return {Buffer}
   */
  decode(stream) {
    let length = this.size;
    if (length === undefined) {
      length = Number(uIntCoder.decode(stream));
    }

    return Buffer.from(stream.read(length * 2, true), 'hex');
  }

  encodeTopic(value) {
    assert(Buffer.isBuffer(value), {
      message: 'value type error',
      expect: Buffer.name,
      got: value.constructor.name,
      coder: this,
    });

    return sign.sha3(value);
  }

  decodeTopic(hex) {
    return hex;
  }
}

module.exports = BytesCoder;
