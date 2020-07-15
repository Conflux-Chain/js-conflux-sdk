const lodash = require('lodash');
const { assert, format } = require('../util');
const BaseCoder = require('./BaseCoder');
const { encodeUInt256, decodeUInt256, pack, unpack } = require('./util');

class ArrayCoder extends BaseCoder {
  static from({ type, name, components }, abiCoder) {
    const match = type.match(/^(.*)\[([0-9]*)]$/);
    if (!match) {
      return undefined;
    }

    const [, subType, size] = match;
    return new this({
      name,
      coder: abiCoder({ type: subType, components }),
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  constructor({ name, coder, size }) {
    if (size !== undefined) {
      assert(Number.isInteger(size) && 0 < size, {
        message: 'invalid size',
        expect: 'integer && >0',
        got: size,
        coder: { name },
      });
    }

    super({ name });
    this.type = `${coder.type}[${size > 0 ? size : ''}]`;
    this.size = size;
    this.coder = coder;
    this.dynamic = Boolean(size === undefined) || coder.dynamic;
  }

  /**
   * @param array {array}
   * @return {Buffer}
   */
  encode(array) {
    assert(Array.isArray(array), {
      message: 'unexpected type',
      expect: 'array',
      got: typeof array,
      coder: this,
    });

    if (this.size !== undefined) {
      assert(array.length === this.size, {
        message: 'length not match',
        expect: this.size,
        got: array.length,
        coder: this,
      });
    }

    const coders = lodash.range(array.length).map(() => this.coder);
    let buffer = pack(coders, array);
    if (this.size === undefined) {
      buffer = Buffer.concat([encodeUInt256(array.length), buffer]);
    }
    return buffer;
  }

  /**
   * @param stream {HexStream}
   * @return {array}
   */
  decode(stream) {
    let length = this.size;

    if (length === undefined) {
      length = Number(decodeUInt256(stream));
    }

    const coders = lodash.range(length).map(() => this.coder);
    return unpack(coders, stream);
  }

  encodeIndex(value) {
    try {
      return format.hex64(value);
    } catch (e) {
      throw new Error('not supported encode array to index');
    }
  }

  decodeIndex(hex) {
    return hex;
  }
}

module.exports = ArrayCoder;
