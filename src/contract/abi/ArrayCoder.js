const lodash = require('lodash');
const { assert } = require('../../util');
const format = require('../../util/format');
const BaseCoder = require('./BaseCoder');
const { uIntCoder } = require('./IntegerCoder');
const { pack, unpack } = require('./TupleCoder');

class ArrayCoder extends BaseCoder {
  static from({ type, components, ...options }, valueCoder) {
    const match = type.match(/^(.*)\[([0-9]*)]$/);
    if (!match) {
      return undefined;
    }

    const [, subType, size] = match;
    return new this({
      ...options,
      coder: valueCoder({ type: subType, components }),
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
      buffer = Buffer.concat([uIntCoder.encode(array.length), buffer]);
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
      length = format.uInt(uIntCoder.decode(stream)); // XXX: BigInt => Number, for length is enough.
    }

    const coders = lodash.range(length).map(() => this.coder);
    return unpack(coders, stream);
  }

  encodeTopic(value) {
    try {
      return format.hex64(value);
    } catch (e) {
      // TODO https://solidity.readthedocs.io/en/v0.7.4/abi-spec.html#encoding-of-indexed-event-parameters
      throw new Error('not supported encode array to index');
    }
  }

  decodeTopic(hex) {
    return hex;
  }
}

module.exports = ArrayCoder;
